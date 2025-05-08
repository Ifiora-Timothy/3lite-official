import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import ChatListItem from './ChatListItem';
import Input from '../UI/Input';
import Button from '../UI/Button';

interface ChatListProps {
  onChatSelect: () => void;
}

const ChatList: React.FC<ChatListProps> = ({ onChatSelect }) => {
  const { chats, filterChats, searchChats } = useChat();
  const [activeFilter, setActiveFilter] = useState<'all' | 'pinned' | 'ai' | 'group'>('all');

  const handleFilterChange = (filter: 'all' | 'pinned' | 'ai' | 'group') => {
    setActiveFilter(filter);
    filterChats(filter);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchChats(e.target.value);
  };

  const handleChatItemClick = () => {
    onChatSelect();
  };

  return (
    <div className="w-full h-full glass-effect flex flex-col border-r border-white/10">
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Messages</h2>
          <Button 
            variant="primary" 
            size="sm" 
            icon={<Plus size={18} />}
            className="floating-button"
          >
            New Chat
          </Button>
        </div>
        
        <Input 
          variant="search" 
          placeholder="Search conversations..." 
          onChange={handleSearch}
        />
        
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          <Button 
            variant={activeFilter === 'all' ? 'primary' : 'ghost'}
            size="sm" 
            onClick={() => handleFilterChange('all')}
          >
            All
          </Button>
          <Button 
            variant={activeFilter === 'pinned' ? 'primary' : 'ghost'}
            size="sm" 
            onClick={() => handleFilterChange('pinned')}
          >
            Pinned
          </Button>
          <Button 
            variant={activeFilter === 'ai' ? 'primary' : 'ghost'}
            size="sm" 
            onClick={() => handleFilterChange('ai')}
          >
            AI
          </Button>
          <Button 
            variant={activeFilter === 'group' ? 'primary' : 'ghost'}
            size="sm" 
            onClick={() => handleFilterChange('group')}
          >
            Group
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="mb-4 p-4 rounded-full bg-primary-color/10">
              <MessageSquare className="text-primary-color" size={32} />
            </div>
            <h3 className="font-semibold text-lg mb-2">No conversations found</h3>
            <p className="text-sm opacity-70">
              Start a new chat or adjust your search filters
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {chats.map(chat => (
              <ChatListItem 
                key={chat.id} 
                chat={chat} 
                onClick={handleChatItemClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Import for the no-conversations icon
import { MessageSquare } from 'lucide-react';

export default ChatList;