"use client";
import React, { useState } from "react";
import VerticalLayout from "./VerticalLayout";
import IconWrapper from "./ui/IconWrapper";
import CustomIcon from "./ui/CustomIcon";
// import ChatsSidebar from "./ChatsSidebar";
import clsx from "clsx";
import ChatList from "./ChatSidebarOg";
import Button from "../UI/Button";
import { Plus } from "lucide-react";
import { useChat } from "../contexts/ChatContext";

type Props = { className?: string };

export default function SidebarWindow({ className }: Props) {
 
  const {setShowChatList,isMobile} = useChat();

  const handleChatSelect = () => {
    if (isMobile) {
      setShowChatList(false);
    }
  };

  return (
    <VerticalLayout
      header={
        <div className="flex px-4  items-center justify-between">
          <h2 className="text-xl rounded-lg font-bold">Messages</h2>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={18} />}
            className="shrink-0"
          >
            New Chat
          </Button>
        </div>
      }
      main={
        <div className="md:w-80">
          <ChatList onChatSelect={handleChatSelect} />
        </div>
      }
      className={clsx("border-r border-white/10", {
        " ": !className,
        [className || ""]: className,
      })}
    ></VerticalLayout>
  );
}
