"use client";
import VerticalLayout from "./VerticalLayout";
// import ChatsSidebar from "./ChatsSidebar";
import clsx from "clsx";
import ChatList from "./ChatList";
import Button from "../UI/Button";
import { Plus } from "lucide-react";
import { useChat } from "../contexts/ChatContext";

type Props = { className?: string };

export default function SidebarWindow({ className }: Props) {
  const {setShowChatList,isMobile,showChatList} = useChat();

  const handleChatSelect = () => {
    if (isMobile) {
      setShowChatList(false);
    }
  };
console.log({isMobile,showChatList})

  return (
    <VerticalLayout
      header={
        <div className="flex px-4 w-full  items-center justify-between">
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
