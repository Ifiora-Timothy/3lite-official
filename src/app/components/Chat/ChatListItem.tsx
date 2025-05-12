import React from 'react';
import { Pin, Users } from 'lucide-react';
import Avatar from '@/app/UI/Avatar';
import { useChat } from '../../contexts/ChatContext';
import { Chat } from '@/types';

interface ChatListItemProps {
  // chat: Chat;
  chat:Chat;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ chat}) => {
  const { activeChat, setActiveChat,isMobile,setShowChatList } = useChat();
  const isActive = activeChat?._id === chat._id;


  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const handleClick = () => {
    setActiveChat(chat);
    if (isMobile) {
      setShowChatList(false);
    }
    
  };

  return (
    <div 
      className={`p-3  rounded-xl cursor-pointer chat-list-item ${
        isActive ? 'bg-hover-bg glow-border' : 'hover:bg-hover-bg'
      } transition-all duration-300`}
      onClick={handleClick}
    >
      <div className="flex  items-center gap-3">
        <Avatar 
          src={chat.avatar} 
          name={chat.username} 
          status={chat.status} 
          walletAddress={chat.walletAddress}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <h3 className="font-medium truncate">{chat.username}</h3>
              {chat.type==="ai" && (
                <span className="text-xs bg-accent-color/20 text-accent-color py-0.5 px-1.5 rounded-full">
                  AI
                </span>
              )}
              {chat.type==="group" && <Users size={14} className="text-accent-color" />}
            </div>
            <div className="flex items-center gap-1">
              {chat.pinned && <Pin size={14} className="text-primary-color" />}
              <span className="text-xs opacity-70">{formatTime(chat.updatedAt)}</span>
            </div>
          </div>
          
          <p className="text-sm truncate  opacity-70 mt-0.5">
            {chat.lastMessage}
          </p>
          
          {chat.unreadCount > 0 && (
            <div className="flex justify-end mt-1">
              <span className="text-xs bg-primary-color text-white rounded-full px-1.5 min-w-5 text-center">
                {chat.unreadCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;