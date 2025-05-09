"use client";

import VerticalLayout from "../components/VerticalLayout";
import SidebarCollapsed from "../components/SidebarCollapsed";
import Logo from "../UI/Logo";
import Link from "next/link";
import { useChat } from "../contexts/ChatContext";


export default function SidebarMini() {
    const {isMobile,showChatList}= useChat();

    const display= isMobile && !showChatList ? "hidden w-0" : "";
  return (
    <VerticalLayout
      header={
        <Link href="/">

        <div className="w-full pt-3  place-items-center ">
          <div className=" w-fit ">
            <Logo size={32} />
          </div>
        </div>
        </Link>
      }
      main={
        <SidebarCollapsed/>
      }
      className={`w-16  border-r border-white/10 ${display}  `}
    ></VerticalLayout>
  );
}
