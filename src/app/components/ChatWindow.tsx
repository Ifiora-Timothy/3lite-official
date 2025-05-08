"use client"
import { useChat } from "../contexts/ChatContext";
import ChatsContainer from "./Chat/ChatsContainer";


const ChatWindow = () => {
  const {setShowProfile,setShowChatList,isMobile} = useChat();



  return (
    <div className="border-r w-full border-white/10 flex flex-col h-full">
      <ChatsContainer
        onViewProfile={() => setShowProfile(true)}
        onShowChatList={() => setShowChatList(true)}
        isMobile={isMobile}
      />
    </div>
  );
};

export default ChatWindow;
