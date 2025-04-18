"use client";
import { ChatContext } from "@/app/providers/ChatContext";

import { useContext } from "react";

export const useChatContext = () => {
  const {
    activeUser,
    setActiveUser,
    type,
    isLoading,
    optimisticMessages,
    messagesEndRef,
    handleSend,
    inputRef,
    scrollToBottom,
  } = useContext(ChatContext);
  return {
    activeUser,
    setActiveUser,
    type,
    isLoading,
    optimisticMessages,
    messagesEndRef,
    handleSend,
    inputRef,
    scrollToBottom,
  };
};
