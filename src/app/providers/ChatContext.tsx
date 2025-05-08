"use client";
import {
  createContext,
  PropsWithChildren,
  useMemo,
  useEffect,
  useState,
  useOptimistic,
  startTransition,
  useRef,
} from "react";
import { TactiveUser } from "../../../types";

import { addMessage, getChat } from "@/actions/dbFunctions";
import { FirebaseChat } from "@/class/firebase_chat";
import useAuth from "../hooks/useAuth";
import { getChats, getUsersFromRegex } from "@/actions/dbFunctions";
import mongoose from "mongoose";
import { IMessage } from "../../../types";
import { IPopulatedChat } from "@/lib/db/models/chat";
import { useChat } from "../contexts/ChatContext";
export const ChatContext = createContext<{
  type: "group" | "private";
  isLoading: boolean;
  optimisticMessages: IMessage[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  handleSend: () => Promise<void>;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  scrollToBottom: () => void;
  getAllChats:()=>Promise<null|IPopulatedChat[]>;
}>(
  {} as {
    type: "group" | "private";
    isLoading: boolean;
    optimisticMessages: IMessage[];
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    handleSend: () => Promise<void>;
    inputRef: React.RefObject<HTMLTextAreaElement | null>;
    scrollToBottom: () => void;
    getAllChats:()=>Promise<null|IPopulatedChat[]>
  }
);

export const ChatProvider = ({ children }: PropsWithChildren) => {
  const {activeChat,setActiveChat}= useChat();
  // const [activeUser, setActiveUser] = useState<TactiveUser | null>(null);

  // State to track the current chat ID
  const [chatId, setChatId] = useState<string | null>(null);
  // Add this near your other state declarations
  const messagesCache = useRef<Record<string, IMessage[]>>({});
  // State to store messages from the database
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [type, setType] = useState<"group" | "private">("private");

  // State to track loading status
  const [isLoading, setIsLoading] = useState(true);
  // Add a new state to track when we're switching between users
  const [isSwitchingUser, setIsSwitchingUser] = useState(false);

  // Reference to the end of the messages list for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Reference to the input field for message entry
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Track the previous active user ID to detect changes
  const prevActiveUserIdRef = useRef<string | null>(null);

  /**
   * Optimistic UI update for instant feedback when sending messages
   * Adds new messages to the UI before server confirmation
   */
  const [optimisticMessages, addOptimisticMessage] = useOptimistic<
    IMessage[],
    IMessage
  >(messages, (state, newMessage) => {
    // Remove any temporary message with the same ID
    const filteredState = state.filter((msg) => msg._id !== newMessage.tempId);
    // Add the new message to the list
    return [...filteredState, newMessage];
  });
  // Keep the isSwitchingUser state but also add a loadingMessages flag
  const [loadingMessages, setLoadingMessages] = useState(true);

  // Access the current authenticated user
  const { activeUser: user } = useAuth();

  /**
   * Scrolls the chat to the bottom to show the latest messages
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [optimisticMessages]);

  

  // Create a memoized key for the chat to help with caching
  const chatKey = useMemo(() => {
    if (activeChat?._id && user?._id) {
      return `chat-${user._id}-${activeChat._id}`;
    }
    return null;
  }, [activeChat?._id, user?._id]);

  /**
   * Clear messages when switching users to prevent flashing of previous messages
   */
  useEffect(() => {
    // If activeUser has changed, set switching state and clear messages
    if (activeChat?._id !== prevActiveUserIdRef.current && activeChat?._id) {
      setLoadingMessages(true); // Set this true immediately when switching users
      setIsSwitchingUser(true);
      setMessages([]);
      prevActiveUserIdRef.current = activeChat._id;
    }
  }, [activeChat?._id]);

  /**
   * Initialize chat when users are selected
   * Fetches chat history between two users
   */
  // Modify the user switching effect to also trigger loadingMessages
  useEffect(() => {
    // If activeUser has changed, set switching state and clear messages
    if (activeChat?._id !== prevActiveUserIdRef.current && activeChat?._id) {
      setIsSwitchingUser(true);
      setLoadingMessages(true); // Set this true immediately when switching users
      setMessages([]);
      prevActiveUserIdRef.current = activeChat._id;
    }
  }, [activeChat?._id]);

  // Modify the chat initialization effect
  useEffect(() => {
    let isMounted = true;

    const initializeChat = async () => {
      // Return early if either user is not defined
      if (!activeChat?._id || !user?._id) {
        if (isMounted) {
          setIsLoading(false);
          setIsSwitchingUser(false);
          setLoadingMessages(false);
          // Don't reset loadingMessages here - keep it for Firebase
        }
        return;
      }

      try {
        if (isMounted) {
          setIsLoading(true);
          // No need to modify loadingMessages here as it should already be true
        }

        // Get chat data from database using server action
        const chatData = await getChat(user._id, activeChat._id);
        const parsedChat = JSON.parse(chatData);

        // If no chat exists between these users
        if (!parsedChat?._id) {
          if (isMounted) {
            setChatId(null);
            setMessages([]);
            // Only set loadingMessages to false here if there will be no chatId
            // since there won't be any Firebase subscription
            // setLoadingMessages(false);
          }
          return;
        }

        if (parsedChat._id && isMounted) {
          // Set the chat ID first
          setChatId(parsedChat._id);
          setType(parsedChat.type);

          // // Check if we already have cached messages for this chat
          // if (messagesCache.current[parsedChat._id]) {
          //   // Use cached messages
          //   setMessages(messagesCache.current[parsedChat._id]);
          //   // Still set loading to false since we have messages
          //   setLoadingMessages(false);
          // }
          setMessages(parsedChat.messages);
          FirebaseChat.syncHistoricalData(parsedChat.messages, parsedChat._id);
          setLoadingMessages(false);
        }
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        if (isMounted) {
          // If there's an error, we need to reset loadingMessages
          setLoadingMessages(false);
        }
      } finally {
        if (isMounted) {
          // Only reset isSwitchingUser and isLoading here
          // loadingMessages will be controlled by the Firebase subscription
          setIsSwitchingUser(false);
          setIsLoading(false);
        }
      }
    };

    initializeChat();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [chatKey]);
  /**
   * Set up real-time message subscription with Firebase
   * Listens for new messages in the current chat
   */
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const setupFirebaseSubscription = async () => {
      if (!chatId) {
        setLoadingMessages(false);

        return;
      }

      try {
        // Only set loading if we don't have cached messages
        // if (!messagesCache.current[chatId]) {
        //   setLoadingMessages(true);
        // }
        // Subscribe to messages for this chat
        unsubscribe = FirebaseChat.subscribeToChat(chatId, (newMessages) => {
          // Convert Firebase messages to our Message interface
          const receivedMessages: IMessage[] = newMessages.map(
            (message: any) => ({
              _id: message._id,
              content: message.content,
              sender: message.sender,
              contentType: message.contentType,
              receiver: message.receiver,
              createdAt: new Date(message.createdAt),
              deliveryStatus: message.deliveryStatus,
            })
          );

          // Update state with new messages and sort by createdAt
          setLoadingMessages(false);
          setMessages(receivedMessages);
          // Cache the messages
          messagesCache.current[chatId] = receivedMessages;

          scrollToBottom();
        });
      } catch (error) {
        setLoadingMessages(false);
        console.error("Firebase subscription error:", error);
      }
    };

    setupFirebaseSubscription();

    // Cleanup function to unsubscribe from Firebase when component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [chatId]);

  /**
   * Send a new message
   * Uses optimistic updates for immediate UI feedback
   */
  const handleSend = async () => {
    console.log("Sending message1:");
    if (!inputRef.current || !activeChat?.username || !user?._id) return;

    console.log("Sending message2:", inputRef.current.value);
    const message = inputRef.current.value.trim();
    if (!message) return;

    console.log("Sending message3:", message);

    // Generate temporary ID for optimistic update
    const tempId = new mongoose.Types.ObjectId().toString();
    const createdAt = new Date();

    // Create optimistic message object
    const optimisticMessage: IMessage = {
      _id: tempId,
      tempId,
      content: message,
      sender: {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        walletAddress: user.walletAddress,
      },
      contentType: "text",
      receiver: {
        _id: activeChat._id,
        username: activeChat.username,
        avatar: activeChat.avatar,
        walletAddress: activeChat.walletAddress ?? "0x0",
      },
      createdAt,
      deliveryStatus: "sending",
    };

    // Clear input field
    inputRef.current.value = "";

    // Start server request in a non-blocking way
    // Wrap both the optimistic update and the server request in startTransition
    startTransition(() => {
      // Add message to UI immediately (optimistic update)
      addOptimisticMessage(optimisticMessage);

      // Then handle the server request
      (async () => {
        try {
          // Send message to server
          const resp = await addMessage({
            id: tempId,
            chatId,
            createdAt,
            sender: user._id,
            receiver: activeChat._id,
            message,
          });
          // If this is a new chat, update the chatId
          if (!chatId) {
            const parsedResp = JSON.parse(resp);
            setChatId(parsedResp.chat._id);
          }
        } catch (error) {
          console.error("Failed to send message:", error);
          // Update UI to show message failed
          const errorMessage: IMessage = {
            ...optimisticMessage,
            deliveryStatus: "sending",
          };
          addOptimisticMessage(errorMessage);
        }
      })();
    });
  };

   const getAllChats = async ():Promise<null|IPopulatedChat[]> => {
    console.log("user",user)
      if (!user?._id) return null;
      try {
       
        const chats = await getChats(user?._id);
        const parsedChats: IPopulatedChat[] = JSON.parse(chats).filter((chat:any)=>{
          // make date in updated type to be a date type
          chat.updatedAt = new Date(chat.updatedAt);
          return chat;
        });
  
        if (parsedChats.length > 0) {
          const otherParticipant = parsedChats[0].participants.filter(
            (participant) => participant._id !== user._id
          )[0];
  
          setActiveChat({
            _id: otherParticipant._id,
            username: otherParticipant.username,
            avatar: otherParticipant.avatar || "",
            walletAddress: otherParticipant.walletAddress ?? "0x0",
            lastMessage: parsedChats[0].lastMessage?.content ?? "no chat yet",
            updatedAt: parsedChats[0].updatedAt.toISOString(),
            status: otherParticipant.status,
            unreadCount: parsedChats[0].unreadCount,
            pinned: user.pinnedChats?.includes(parsedChats[0]._id),
            type: parsedChats[0].type,
          });
        }

        return parsedChats;
      } catch (error) {
        console.error("Error fetching chats:", error);
        throw Error("Failed to load chats");
      } 
    };
  
  return (
    <ChatContext.Provider
      value={{
        type,
        isLoading: isLoading || isSwitchingUser || loadingMessages,
        optimisticMessages,
        messagesEndRef,
        handleSend,
        inputRef,
        scrollToBottom,
        getAllChats
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
