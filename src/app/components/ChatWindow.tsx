"use client";
import React, { useMemo } from "react";
import SendMsgComponent from "./SendMsgComponent";
import ChatsContainer from "./ChatsContainer";

import { addMessage, getChat } from "@/actions/dbFunctions";
import { FirebaseChat } from "@/class/firebase_chat";
import useAuth from "../hooks/useAuth";
import { useChatContext } from "../hooks/useChatContext";

import {
  useEffect,
  useState,
  useOptimistic,
  startTransition,
  useRef,
} from "react";
import mongoose from "mongoose";
import { IMessage } from "../../../types";

const ChatWindow = () => {
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
  const inputRef = useRef<HTMLInputElement | null>(null);

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

  // Access the active chat user from context
  const { activeUser } = useChatContext();

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
    if (activeUser?._id && user?._id) {
      return `chat-${user._id}-${activeUser._id}`;
    }
    return null;
  }, [activeUser?._id, user?._id]);

  /**
   * Clear messages when switching users to prevent flashing of previous messages
   */
  useEffect(() => {
    // If activeUser has changed, set switching state and clear messages
    if (activeUser?._id !== prevActiveUserIdRef.current && activeUser?._id) {
      setLoadingMessages(true); // Set this true immediately when switching users
      setIsSwitchingUser(true);
      setMessages([]);
      prevActiveUserIdRef.current = activeUser._id;
    }
  }, [activeUser?._id]);

  /**
   * Initialize chat when users are selected
   * Fetches chat history between two users
   */
  // Modify the user switching effect to also trigger loadingMessages
  useEffect(() => {
    // If activeUser has changed, set switching state and clear messages
    if (activeUser?._id !== prevActiveUserIdRef.current && activeUser?._id) {
      setIsSwitchingUser(true);
      setLoadingMessages(true); // Set this true immediately when switching users
      setMessages([]);
      prevActiveUserIdRef.current = activeUser._id;
    }
  }, [activeUser?._id]);

  // Modify the chat initialization effect
  useEffect(() => {
    let isMounted = true;

    const initializeChat = async () => {
      // Return early if either user is not defined
      if (!activeUser?._id || !user?._id) {
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
        const chatData = await getChat(user._id, activeUser._id);
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

          // Check if we already have cached messages for this chat
          if (messagesCache.current[parsedChat._id]) {
            // Use cached messages
            setMessages(messagesCache.current[parsedChat._id]);
            // Still set loading to false since we have messages
            setLoadingMessages(false);
          }

          await FirebaseChat.syncHistoricalData(parsedChat._id);
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
          setLoadingMessages(false);
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
        if (!messagesCache.current[chatId]) {
          setLoadingMessages(true);
        }
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
    if (!inputRef.current || !activeUser?.username || !user?._id) return;

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
      sender: {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        walletAddress: user.walletAddress,
      },
      contentType: "text",
      receiver: {
        _id: activeUser._id,
        username: activeUser.username,
        avatar: activeUser.avatar,
        walletAddress: activeUser.walletAddress,
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
            receiver: activeUser._id,
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
            deliveryStatus: "failed",
          };
          addOptimisticMessage(errorMessage);
        }
      })();
    });
  };

  console.log("loading params", {
    isLoading,
    isSwitchingUser,
    loadingMessages,
  });
  return (
    <div className="border-r flex flex-col h-full">
      <ChatsContainer
        type={type}
        isLoading={isLoading || isSwitchingUser || loadingMessages}
        optimisticMessages={optimisticMessages}
        messagesEndRef={messagesEndRef}
      />

      <SendMsgComponent
        handleSend={handleSend}
        inputRef={inputRef}
        disabled={isLoading || isSwitchingUser}
      />
    </div>
  );
};

export default ChatWindow;
