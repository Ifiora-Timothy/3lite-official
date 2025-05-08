"use client";
import { ChatContext } from "@/app/providers/ChatContext";

import { useContext } from "react";

export const useChatContext = () => {
  const {
 
    type,
    isLoading,
    optimisticMessages,
    messagesEndRef,
    handleSend,
    inputRef,
    scrollToBottom,
    getAllChats
  } = useContext(ChatContext);
  return {
    getAllChats,
    type,
    isLoading,
    optimisticMessages,
    messagesEndRef,
    handleSend,
    inputRef,
    scrollToBottom,
  };
};
