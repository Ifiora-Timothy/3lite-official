"use client";
import ChatWindow from "@/app/components/ChatWindow";
import SidebarWindow from "@/app/components/SidebarWindow";
import { useChat } from "@/app/contexts/ChatContext";
import WalletModal from "@/app/modals/WalletModal";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

export default function Chat() {
  const { showChatList, isMobile } = useChat();
  const { connected, connecting } = useWallet();
   const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    // Give wallet adapter time to attempt auto-connection
    const timer = setTimeout(() => {
      // If not connected or connecting after timeout, prompt user
      if (!connected && !connecting) {
        // setShouldPromptForConnection(true);
        const storedUser = localStorage.getItem("3liteuser");
        if(!storedUser) {
          console.log("nouser");
          setShowModal(true);
        }
        console.log("User needs to connect wallet");
      }
    }, 1000); // Short delay to allow auto-connect attempt
    
    return () => clearTimeout(timer);
  }, [connected, connecting]);

  const display= isMobile && showChatList ? "hidden" : "";
  return (
    <div className="w-full bg   h-full flex" >
      <div
        style={{
          backgroundColor: "var(--bg-color)",
        }}
        className={`${showChatList ? "md:flex" : "hidden md:hidden"} md:flex  
            absolute inset-0 z-20 
         md:relative    md:min-w-80 glass-effect shrink-0  h-full`}
    
    >
        <SidebarWindow className="h-full w-full  glass-effect" />
      </div>
      <div className={`md:contents ${display}`}>

      <ChatWindow />
      <WalletModal showModal={showModal} setShowModal={setShowModal}/>
      </div>
    </div>
  );
}
