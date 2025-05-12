import { PropsWithChildren } from "react";
import { ChatProvider } from "../providers/ChatContext";
import { ChatProvider as ChatNewProvider } from "../contexts/ChatContext";
import SidebarMini from "../components/SidebarMini";



export default function ChatLayout({ children }: PropsWithChildren) {
  return (
    <ChatNewProvider>
      <ChatProvider>
        <div
          style={{
            backgroundColor: "var(--bg-color)",
            color: "var(--text-color)",
          }}
          className="h-screen w-screen overflow-hidden relative flex"
        >
          <div className="w-fit glass-effect shrink-0">
            <SidebarMini />
          </div>

          <div className="w-full relative">{children}</div>
        </div>
      </ChatProvider>
    </ChatNewProvider>
  );
}
