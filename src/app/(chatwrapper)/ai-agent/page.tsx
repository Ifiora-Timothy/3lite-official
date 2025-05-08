"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, RefreshCw } from 'lucide-react';
import Button from '@/app/UI/Button';
import Avatar from '@/app/UI/Avatar';
import { ChatMessage } from '@/types';

const AIAgent: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      chatId: 'ai-chat',
      sender: 'ai',
      senderName: 'Nova',
      content: "Hello! I'm Nova, your 3lite AI Assistant. I can help you manage your crypto assets, analyze messages, and provide information. Try asking me something!",
      timestamp: new Date().toISOString(),
      status: 'received',
      isAI: true,
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      chatId: 'ai-chat',
      sender: 'user',
      senderName: 'You',
      content: input,
      timestamp: new Date().toISOString(),
      status: 'sent',
      isAI: false,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        chatId: 'ai-chat',
        sender: 'ai',
        senderName: 'Nova',
        content: getAIResponse(input),
        timestamp: new Date().toISOString(),
        status: 'received',
        isAI: true,
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };
  
  const getAIResponse = (message: string): string => {
    // Mock AI responses based on user input
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('send') && (lowerMessage.includes('eth') || lowerMessage.includes('matic') || lowerMessage.includes('usdt'))) {
      return "I can help you send crypto. Let me prepare that transaction for you.\n\nWould you like to send crypto to one of your contacts or to a specific address?";
    } else if (lowerMessage.includes('nft') || lowerMessage.includes('gallery')) {
      return "Here's a summary of your NFT collection:\n\n• Total NFTs: 12\n• Collections: 5\n• Most valuable: CryptoPunk #3429 (Est. 45 ETH)\n\nWould you like to view your gallery or check details of a specific NFT?";
    } else if (lowerMessage.includes('balance') || lowerMessage.includes('portfolio')) {
      return "Here's your current portfolio summary:\n\n• ETH: 1.45 ($2,105.25)\n• USDC: 250.00 ($250.00)\n• MATIC: 156.78 ($101.07)\n• 3LITE: 340.00\n\nTotal Value: $2,456.32\nUp 3.2% in the last 24h";
    } else if (lowerMessage.includes('news') || lowerMessage.includes('market')) {
      return "Here are today's crypto highlights:\n\n• Bitcoin is up 2.4% in the last 24h\n• Ethereum completed a new network upgrade\n• DeFi TVL increased by 5% this week\n\nWould you like more specific news about any project?";
    } else {
      return "I can help you with various tasks like sending crypto, checking your NFT gallery, tracking your portfolio, or staying updated with crypto news. Just let me know what you need!";
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  const quickActions = [
    { label: 'Send Crypto', icon: <Send size={16} /> },
    { label: 'Portfolio Summary', icon: <RefreshCw size={16} /> },
    { label: 'NFT Gallery', icon: <Image size={16} /> },
    { label: 'Crypto News', icon: <Newspaper size={16} /> },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="glass-effect p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-color/20 flex items-center justify-center">
            <Brain size={24} className="text-accent-color" />
          </div>
          <div>
            <h2 className="font-bold">Nova AI Assistant</h2>
            <p className="text-xs opacity-70">Your personal Web3 assistant</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'ai' && (
                <div className="flex-shrink-0 mt-1 mr-3">
                  <Avatar 
                    size="md" 
                    name="Nova AI" 
                  />
                </div>
              )}
              
              <div 
                className={`max-w-[80%] message-bubble ${
                  message.sender === 'user' ? 'message-sent' : 'message-received'
                }`}
              >
                <div
                  className={`
                    rounded-2xl px-4 py-3 
                    ${message.sender === 'user' ? 'bg-primary-color text-white' : 
                      'bg-accent-color/20 border border-accent-color/30'
                    }
                  `}
                >
                  {message.content.split('\n').map((line, i) => (
                    <p key={i} className={line ? 'mb-1' : 'mb-3'}>
                      {line || '\u00A0'}
                    </p>
                  ))}
                  
                  <div className="text-xs mt-1 opacity-70 text-right">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex-shrink-0 mt-1 mr-3">
                <Avatar 
                  size="md" 
                  name="Nova AI" 
                />
              </div>
              <div className="glass-effect rounded-2xl px-4 py-3 bg-accent-color/10">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-accent-color/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-accent-color/60 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
                  <span className="w-2 h-2 bg-accent-color/60 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="p-4 glass-effect border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                icon={action.icon}
                onClick={() => setInput(action.label)}
              >
                {action.label}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <textarea
              className="glass-effect flex-1 p-3 rounded-xl focus:outline-none focus:glow-border resize-none min-h-[60px]"
              placeholder="Ask Nova anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <Button
              variant="primary"
              icon={<Send size={20} />}
              onClick={handleSendMessage}
              className="self-end"
              aria-label="Send message"
            />
          </div>
          
          <p className="text-xs opacity-50 mt-2 text-center">
            Try commands like "Send 5 ETH to Taylor" or "Show me my NFT gallery"
          </p>
        </div>
      </div>
    </div>
  );
};

// Missing imports
import { Image, Newspaper } from 'lucide-react';

export default AIAgent;