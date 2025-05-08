
import React, { PropsWithChildren } from "react";
import VerticalLayout from "../components/VerticalLayout";
import SidebarCollapsed from "../components/SidebarCollapsed";
import { ChatProvider } from "../providers/ChatContext";
import Logo from "../UI/Logo";
import {
  ChatProvider as ChatNewProvider,
  
} from "../contexts/ChatContext";
import Link from "next/link";


function SidebarMini() {

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
      className="w-full  border-r border-white/10"
    ></VerticalLayout>
  );
}

// Move this component inside the provider
function ChatLayoutContent({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        gridTemplateColumns: "repeat(16, minmax(0, 1fr))",
      }}
      className="h-screen w-screen relative flex"
    >
      <div className="md:w-16   glass-effect   shrink-0">
        <SidebarMini />
      </div>

      <div className="w-full">{children}</div>
    </div>
  );
}

export default function ChatLayout({ children }: PropsWithChildren) {
  return (
    <ChatNewProvider>
      <ChatProvider>
        <ChatLayoutContent>{children}</ChatLayoutContent>
      </ChatProvider>
    </ChatNewProvider>
  );
}
