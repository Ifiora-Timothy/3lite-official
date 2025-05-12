"use client";
import { ChatContext } from "@/app/providers/ChatContext";

import { useContext } from "react";

export const useChatContext = () => {
 return useContext(ChatContext);

};
