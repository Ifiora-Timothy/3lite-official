"use client";
import ChatWindow from "@/app/components/ChatWindow";
import SidebarWindow from "@/app/components/SidebarWindow";
import { useChat } from "@/app/contexts/ChatContext";

export default function page() {
  const { showChatList, isMobile } = useChat();

  return (
    <div className="w-full  h-full flex" >
      <div
        style={{
          backgroundColor: "var(--bg-color)",
        }}
        className={`${showChatList ? "flex" : "hidden"} md:flex  ${
          isMobile ? "absolute inset-0 z-20" : ""
        } md:relative    min-w-80 glass-effect shrink-0  h-full`}
    
    >
        <SidebarWindow className="h-full w-full  glass-effect" />
      </div>
      <ChatWindow />
    </div>
  );
}
