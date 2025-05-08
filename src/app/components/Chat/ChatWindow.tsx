"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, SmilePlus, User, PlusCircle, ChevronLeft } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import Button from '@/app/UI/Button';
import MessageBubble from './MessageBubble';
import NFTPreview from './NFTPreview';
import TransferModal from '@/app/modals/TransferModal';
import Avatar from '@/app/UI/Avatar';

interface ChatWindowProps {
  onViewProfile: () => void;
  onShowChatList: () => void;
  isMobile: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onViewProfile, onShowChatList, isMobile }) => {
  const { activeChat, messages, sendMessage } = useChat();
  const [messageInput, setMessageInput] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center glass-effect">
        <div className="text-center max-w-md p-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary-color/20 flex items-center justify-center mb-4">
            <MessageSquare size={28} className="text-primary-color" />
          </div>
          <h3 className="text-xl font-bold mb-2">No conversation selected</h3>
          <p className="opacity-70 mb-4">
            Select a chat from the list or start a new conversation
          </p>
          <Button icon={<PlusCircle size={18} />} variant="primary">
            New Chat
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="glass-effect flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              icon={<ChevronLeft size={20} />}
              onClick={onShowChatList}
              className="mr-2"
              aria-label="Back to chat list"
              >.</Button>
          )}
          <Avatar 
            src={activeChat.avatar} 
            name={activeChat.name} 
            status={activeChat.status}
            walletAddress={activeChat.address}
          />
          <div>
            <h2 className="font-bold">{activeChat.name}</h2>
            <p className="text-xs opacity-70">
              {activeChat.address || activeChat.subtitle || 'Last active recently'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            icon={<User size={18} />} 
            onClick={onViewProfile}
          >
            Profile
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => setShowTransferModal(true)}
          >
            Send Asset
          </Button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {/* Example NFT preview */}
          {activeChat.id === 'chat-1' && (
            <div className="py-2">
              <NFTPreview 
                name="Bored Ape #5234"
                image="https://images.pexels.com/photos/11765870/pexels-photo-11765870.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                collection="Bored Ape Yacht Club"
                sender={activeChat.name}
              />
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Message Input */}
      <div className="glass-effect p-4 border-t border-white/10">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              className="glass-effect w-full p-3 rounded-xl focus:outline-none focus:glow-border resize-none min-h-[60px]"
              placeholder="Type a message or use /commands..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              icon={<Image size={20} />}
              aria-label="Attach file"
            >.</Button>
            <Button 
              variant="ghost" 
              size="sm" 
              icon={<SmilePlus size={20} />}
              aria-label="Add emoji"
              >.</Button>
            <Button 
              variant="primary" 
              size="sm" 
              icon={<Send size={20} />}
              onClick={handleSendMessage}
              aria-label="Send message"
              >.</Button>
          </div>
        </div>
      </div>
      
      {/* Transfer Modal */}
      {showTransferModal && (
        <TransferModal 
          recipient={activeChat} 
          onClose={() => setShowTransferModal(false)} 
        />
      )}
    </div>
  );
};

// Import missing icons
import { MessageSquare } from 'lucide-react';

export default ChatWindow;