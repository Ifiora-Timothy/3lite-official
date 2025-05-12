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

import { addMessage, getChat } from "@/actions/dbFunctions";
import { FirebaseChat } from "@/class/firebase_chat";
import useAuth from "../hooks/useAuth";
import { getChats } from "@/actions/dbFunctions";
import mongoose from "mongoose";
import { IMessage } from "../../types";
import { useChat } from "../contexts/ChatContext";

import { Chat } from "@/types";

type IChatContext = {
  type: "group" | "private" | "ai";
  isLoading: boolean;
  optimisticMessages: IMessage[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  handleSend: (type: "private" | "group" | "ai") => Promise<void>;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  scrollToBottom: () => void;
  getAllChats: () => Promise<null | Chat[]>;
  currChats: Chat[];
};
export const ChatContext = createContext<IChatContext>({} as IChatContext);

export const ChatProvider = ({ children }: PropsWithChildren) => {
  const [chatId, setChatId] = useState<string | null>(null);
  const messagesCache = useRef<Record<string, IMessage[]>>({});
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [type, setType] = useState<"group" | "private">("private");
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitchingUser, setIsSwitchingUser] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [currChats, setCurrChats] = useState<Chat[]>([]);
  const [optimisticMessages, addOptimisticMessage] = useOptimistic<
    IMessage[],
    IMessage
  >(messages, (state, newMessage) => {
    const filteredState = state.filter((msg) => msg._id !== newMessage.tempId); // Remove any temporary message with the same ID
    return [...filteredState, newMessage]; // Add the new message to the list
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const prevActiveUserIdRef = useRef<string | null>(null);

  const { activeChat, setActiveChat } = useChat();
  const { activeUser } = useAuth(); // Access the current authenticated activeUser

  // Create a memoized key for the chat to help with caching
  const chatKey = useMemo(() => {
    if (activeChat?._id && activeUser?._id) {
      return `chat-${activeUser._id}-${activeChat._id}`;
    }
    return null;
  }, [activeChat?._id, activeUser?._id]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [optimisticMessages]);
  /**
   * Clear messages when switching users to prevent flashing of previous messages
   */

  // Modify the activeUser switching effect to also trigger loadingMessages
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
      // Return early if either activeUser is not defined
      if (!activeChat?._id || !activeUser?._id) {
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
        const chatData = await getChat(
          activeChat.type,
          activeUser._id,
          activeChat._id
        );
        const parsedChat = JSON.parse(chatData);

        // If no chat exists between these users
        if (!parsedChat?._id) {
          if (isMounted) {
            setChatId(null);
            setMessages([]);
          }
          return;
        }

        if (parsedChat._id && isMounted) {
          // Set the chat ID first
          setChatId(parsedChat._id);
          setType(parsedChat.type);

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
        // Subscribe to messages for this chat
        unsubscribe = FirebaseChat.subscribeToChat(chatId, (newMessages) => {
          // Convert Firebase messages to our Message interface
          const receivedMessages: IMessage[] = newMessages.map(
            (message: any) => ({
              _id: message._id,
              content: message.content,
              chat: message.chat,
              sender: message.sender,
              contentType: message.contentType,
              receiverType: message.receiverType,
              receiver: message.receiver,
              createdAt: new Date(message.createdAt),
              deliveryStatus: message.deliveryStatus,
              deliveredTo: message.deliveredTo,
              readBy: message.readBy,
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

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    if (!activeUser?._id) return;

    const setupFirebaseUserSubscription = async () => {
      try {
  
        // Subscribe to messages for this chat
        unsubscribe = FirebaseChat.subscribeToUserChats(
          activeUser._id,
          async (_chats) => {
            
            //  const chats = await getAllChats();
            //  
            
            const chats = await getChats(activeUser?._id);
       
            const parsedChats: Chat[] = JSON.parse(chats).filter(
              (chat: any) => {
                // make date in updated type to be a date type
                chat.updatedAt = new Date(chat.updatedAt);
                return chat;
              }
            );
            
            setCurrChats(parsedChats);
          }
        );
      } catch (error) {
        setLoadingMessages(false);
        console.error("Firebase subscription error:", error);
      }
    };
    setupFirebaseUserSubscription();

    // Cleanup function to unsubscribe from Firebase when component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [activeUser?._id]);

  // get all chats when user is connected
  useEffect(() => {
    async function fetchChats() {
      if (!activeUser?._id) return null;
      const chats = await getAllChats();
      if (!chats) {
        console.error("Failed to fetch chats");
        return;
      }
      setCurrChats(chats);
    }

    fetchChats();
  }, [activeUser?._id]);

  /**
   * Scrolls the chat to the bottom to show the latest messages
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * Send a new message
   * Uses optimistic updates for immediate UI feedback
   */
  const handleSend = async (type: "private" | "group" | "ai") => {
    if (!inputRef.current || !activeChat?.username || !activeUser?._id) return;
    const message = inputRef.current.value.trim();
    if (!message) return;

    // Generate temporary ID for optimistic update
    const tempId = new mongoose.Types.ObjectId().toString();
    const createdAt = new Date();

    // Create optimistic message object
    const optimisticMessage: IMessage = {
      _id: tempId,
      tempId,
      content: message,
      chat: chatId || tempId,
      sender: {
        _id: activeUser._id,
        username: activeUser.username,
        avatar: activeUser.avatar,
        walletAddress: activeUser.walletAddress,
      },
      receiverType: activeChat.type == "group" ? "Chat" : "User",
      contentType: "text",
      receiver: {
        _id: activeChat._id,
        username: activeChat.username,
        avatar: activeChat.avatar,
        walletAddress: activeChat.walletAddress ?? "0x0",
      },
      createdAt,
      deliveryStatus: "sending",
      deliveredTo: [],
      readBy: [],
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
            sender: activeUser._id,
            receiver: activeChat._id,
            message,
            type,
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

  const getAllChats = async (): Promise<null | Chat[]> => {
    if (!activeUser?._id) return null;
    try {
      const chats = await getChats(activeUser?._id);
      const parsedChats: Chat[] = JSON.parse(chats).filter((chat: any) => {
        // make date in updated type to be a date type
        chat.updatedAt = new Date(chat.updatedAt);
        return chat;
      });
      
      setActiveChat(parsedChats[0]);

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
        getAllChats,
        currChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
