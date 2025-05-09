"use client";
import React from 'react';
import { X, Edit, ExternalLink, Copy, Grid } from 'lucide-react';
import Button from '@/app/UI/Button';
import Avatar from '@/app/UI/Avatar';
import { Send } from 'lucide-react';
import useAuth from '@/app/hooks/useAuth';


const ProfilePanel= () => {
  const { activeUser } = useAuth();
  if (!activeUser) {
  //noactiveUser
  return <div className="

  ">
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-500">No active user found</p>
    </div>
  </div>
  }
  const user = {
    name: activeUser.username,
    address: activeUser.walletAddress,
    bio: 'Web3 developer and NFT collector. Building on Ethereum since 2018.',
    tokens: [
      { name: 'Ethereum', symbol: 'ETH', balance: '1.45', icon: '⧫' },
      { name: 'USD Coin', symbol: 'USDC', balance: '350.20', icon: '○' },
      { name: '3lite Token', symbol: '3LITE', balance: '240.00', icon: '✦' },
    ],
    nftCount: 6
  };

  const isFullPage = true; // This can be a prop or state to determine if it's full page or not
  const onClose = () => {
    // Handle close action
  };
  return (
    <div 
      className={`glass-effect h-full flex flex-col ${
        isFullPage ? 'w-full' : 'border-l border-white/10'
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <h2 className="text-xl font-bold">Profile</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-hover-bg rounded-full"
            aria-label="Close profile"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3">
            <Avatar 
              name={user.name}
              src={activeUser.avatar} 
              size="xl" 
              status="online"
            />
          </div>
          <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
          
          <div className="flex items-center justify-center gap-1.5 mb-3">
            <div className="px-2 py-1 bg-primary-color/10 rounded-full text-sm truncate max-w-[200px]">
              {user.address.substring(0, 6)}...{user.address.substring(user.address.length - 4)}
            </div>
            <button className="p-1 hover:bg-hover-bg rounded-full" aria-label="Copy address">
              <Copy size={16} />
            </button>
            <button className="p-1 hover:bg-hover-bg rounded-full" aria-label="View on explorer">
              <ExternalLink size={16} />
            </button>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button 
              variant="primary" 
              size="sm" 
              icon={<Send size={16} />}
            >
              Send
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              icon={<Edit size={16} />}
            >
              Edit Profile
            </Button>
          </div>
        </div>
        
        {/* Bio */}
        <div className="glass-effect rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">Bio</h3>
          <p className="text-sm opacity-80">{user.bio}</p>
        </div>
        
        {/* Assets Summary */}
        <div className="glass-effect rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Assets</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              icon={<Grid size={16} />}
              onClick={() => {/* Navigate to full assets view */}}
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {/* Token Summary */}
            <div className="flex items-center justify-between p-2 rounded bg-primary-color/5">
              <span className="text-sm">Tokens</span>
              <span className="font-medium">{user.tokens.length}</span>
            </div>
            
            {/* NFT Summary */}
            <div className="flex items-center justify-between p-2 rounded bg-accent-color/5">
              <span className="text-sm">NFTs</span>
              <span className="font-medium">{user.nftCount}</span>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="glass-effect rounded-lg p-4">
          <h3 className="font-semibold mb-2">Recent Activity</h3>
          <div className="text-sm opacity-70 text-center py-4">
            No recent activity
          </div>
        </div>
      </div>
    </div>
  );
};



export default ProfilePanel;