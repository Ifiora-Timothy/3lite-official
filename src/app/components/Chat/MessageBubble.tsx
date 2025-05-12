import React from 'react';
import { Check, CheckCheck,ClockFading } from 'lucide-react';
import Avatar from '@/app/UI/Avatar';
import { IMessage } from '../../../types';
import useAuth from '@/app/hooks/useAuth';

interface MessageBubbleProps {
  message: IMessage;
  type:"group" | "private" | "ai"
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message,type }) => {
  const {activeUser}= useAuth();
  if(!activeUser) return null;
  const isSent = message.sender.username === activeUser.username;
  const isAI = type === 'ai';

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  const renderStatusIcon = () => {
    if (message.deliveryStatus === 'sent') {
      return <Check size={14} className="text-gray-400" />;
    } else if (message.deliveryStatus === 'delivered') {
      return <CheckCheck size={14} className="text-gray-400" />;
    } else if (message.deliveryStatus === 'read') {
      return <CheckCheck size={14} className="text-primary-color" />;
    }
    else{
      return <ClockFading size={14} className="text-gray-400" />;
    }
    return null;
  };

  return (
    <div className={`flex gap-2 ${isSent ? 'justify-end' : 'justify-start'}`}>
      {!isSent && (
        <div className="flex-shrink-0 mt-1">
          <Avatar 
            size="sm" 
            name={message.sender.username} 
            src={message.sender.avatar}
          />
        </div>
      )}
      
      <div 
        className={`max-w-[85%] md:max-w-[70%] message-bubble ${
          isSent ? 'message-sent' : 'message-received'
        } ${isAI ? 'ai-message' : ''}`}
      >
        <div
          className={`
            rounded-2xl px-4 py-2 
            ${isSent ? 'bg-primary-color text-white' : 
              isAI ? 'bg-accent-color/20 border border-accent-color/30' : 
              'glass-effect'
            }
          `}
        >
          {isAI && (
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs bg-accent-color/30 text-accent-color py-0.5 px-1.5 rounded-full">
                AI Assistant
              </span>
            </div>
          )}
          
          {message.content.split('\n').map((line, i) => (
            <p key={i} className={line ? 'mb-1' : 'mb-3'}>
              {line || '\u00A0'}
            </p>
          ))}
          
          <div className={`flex text-xs mt-1 gap-1 opacity-70 ${isSent ? 'justify-end' : 'justify-start'}`}>
            <span>{formatTime(new Date(message.createdAt).toISOString())}</span>
            {isSent && renderStatusIcon()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;