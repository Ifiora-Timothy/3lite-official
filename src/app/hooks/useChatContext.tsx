"use client";
import { ChatContext } from "@/app/providers/ChatContext";

import { useContext } from "react";

export const useChatContext = () => {
  const { activeUser, setActiveUser } = useContext(ChatContext);
  return { activeUser, setActiveUser };
};
