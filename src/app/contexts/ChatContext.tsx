"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ChatMessage, Chat} from '@/types';
import { chatData, messageData } from '@/data/mockData';

interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  messages: ChatMessage[];
  setActiveChat: (chat: Chat) => void;
  sendMessage: (content: string) => void;
  filterChats: (filter: 'all' | 'pinned' | 'ai' | 'group') => void;
  searchChats: (query: string) => void;
  showProfile:boolean;
  setShowProfile:(showProfile: boolean) => void;
  showChatList:boolean;
  setShowChatList:(showChatList: boolean) => void;
  isMobile:boolean;
  setIsMobile:(isMobile: boolean) => void;
}

const ChatContext = createContext<ChatContextType>({
  chats: [],
  activeChat: null,
  messages: [],
  setActiveChat: () => {},
  sendMessage: () => {},
  filterChats: () => {},
  searchChats: () => {},
  showProfile:false,
  setShowProfile: () => {},
  showChatList:true,
  setShowChatList: () => {},
  isMobile:false,
  setIsMobile: () => {},
});

export const useChat = () => useContext(ChatContext);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>(chatData);
  const [filteredChats, setFilteredChats] = useState<Chat[]>(chatData);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(messageData);
 const [showProfile, setShowProfile] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  
  
  const [isMobile, setIsMobile] = useState(false);


  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowChatList(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const handleSetActiveChat = (chat: Chat) => {
         
    setActiveChat(chat);
    // In a real app, we would fetch messages for this chat
    setMessages(messageData.filter(msg => msg.chatId === chat._id));
  };

  const sendMessage = (content: string) => {
    if (!activeChat) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      chatId: activeChat._id,
      sender: 'user',
      senderName: 'You',
      content,
      timestamp: new Date().toISOString(),
      status: 'sent',
      isAI: false,
    };

    setMessages(prev => [...prev, newMessage]);

    // Check if it's a command
    if (content.startsWith('/')) {
      handleCommand(content);
    }
  };

  const handleCommand = (command: string) => {
    if (!activeChat) return;
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        chatId: activeChat._id,
        sender: 'ai',
        senderName: 'Nova AI',
        content: getAIResponse(command),
        timestamp: new Date().toISOString(),
        status: 'received',
        isAI: true,
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (command: string): string => {
    if (command.startsWith('/send')) {
      return "I've prepared a transaction for you. Would you like to send 5 ETH to vitalik.eth? [Confirm] [Cancel]";
    } else if (command.startsWith('/nft')) {
      return "Here are your NFTs. You have 12 collectibles across 3 wallets.";
    } else if (command.startsWith('/tip')) {
      return "Tip prepared. Ready to send 0.1 ETH as a tip? [Confirm] [Cancel]";
    } else {
      return "I'm not sure how to help with that command. Try /send, /nft, or /tip.";
    }
  };

  const filterChats = (filter: 'all' | 'pinned' | 'ai' | 'group') => {
    if (filter === 'all') {
      setFilteredChats(chats);
    } else if (filter === 'pinned') {
      setFilteredChats(chats.filter(chat => chat.pinned));
    } else if (filter === 'ai') {
      setFilteredChats(chats.filter(chat => chat.type === 'ai'));
    } else if (filter === 'group') {
      setFilteredChats(chats.filter(chat => chat.type === 'group'));
    }
  };

  const searchChats = (query: string) => {
    if (!query.trim()) {
      setFilteredChats(chats);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    setFilteredChats(
      chats.filter(
        chat => 
          chat.username.toLowerCase().includes(lowerQuery) || 
          chat.lastMessage.toLowerCase().includes(lowerQuery)
      )
    );
  };

  return (
    <ChatContext.Provider
      value={{
        chats: filteredChats,
        activeChat,
        messages,
        setActiveChat: handleSetActiveChat,
        sendMessage,
        filterChats,
        searchChats,
        showProfile,
        isMobile,
        setIsMobile,
        setShowChatList,
        setShowProfile,
        showChatList
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};