"use client";
import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '@/app/UI/Button';
import { Moon, Sun, Bell, Shield, Wallet, Info, LogOut } from 'lucide-react';

type SettingsTab = 'appearance' | 'notifications' | 'wallets' | 'privacy' | 'about';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');
  
  const wallets = [
    { name: 'MetaMask', connected: true, address: '0x71C7...976F', primary: true },
    { name: 'Phantom', connected: false, address: '', primary: false },
    { name: 'WalletConnect', connected: false, address: '', primary: false },
  ];
  
  const languages = ['English', 'Spanish', 'French', 'Japanese', 'Korean'];
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Theme</h3>
              <div className="flex gap-4">
                <div
                  className={`glass-effect p-4 rounded-xl cursor-pointer ${
                    theme === 'light' ? 'glow-border' : ''
                  }`}
                  onClick={() => theme === 'dark' && toggleTheme()}
                >
                  <div className="bg-white rounded-lg p-3 mb-3 flex justify-center">
                    <Sun size={24} className="text-yellow-500" />
                  </div>
                  <p className="text-center font-medium">Light</p>
                </div>
                
                <div
                  className={`glass-effect p-4 rounded-xl cursor-pointer ${
                    theme === 'dark' ? 'glow-border' : ''
                  }`}
                  onClick={() => theme === 'light' && toggleTheme()}
                >
                  <div className="bg-gray-800 rounded-lg p-3 mb-3 flex justify-center">
                    <Moon size={24} className="text-blue-400" />
                  </div>
                  <p className="text-center font-medium">Dark</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Language</h3>
              <div className="glass-effect rounded-xl overflow-hidden">
                {languages.map((language, index) => (
                  <div 
                    key={index}
                    className={`
                      p-3 flex justify-between items-center cursor-pointer hover:bg-hover-bg
                      ${index !== languages.length - 1 ? 'border-b border-white/10' : ''}
                      ${language === 'English' ? 'bg-primary-color/10' : ''}
                    `}
                  >
                    <span>{language}</span>
                    {language === 'English' && (
                      <span className="text-xs bg-primary-color text-white rounded-full px-2 py-0.5">
                        Active
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Notification Settings</h3>
              <div className="glass-effect rounded-xl overflow-hidden">
                {[
                  { label: 'New Messages', enabled: true },
                  { label: 'Transaction Updates', enabled: true },
                  { label: 'Price Alerts', enabled: false },
                  { label: 'NFT Activity', enabled: true },
                  { label: 'System Announcements', enabled: true },
                ].map((item, index, arr) => (
                  <div 
                    key={index}
                    className={`
                      p-4 flex justify-between items-center
                      ${index !== arr.length - 1 ? 'border-b border-white/10' : ''}
                    `}
                  >
                    <span>{item.label}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={item.enabled}
                        onChange={() => {}}
                      />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-primary-color peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'wallets':
        return (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Connected Wallets</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  icon={<PlusCircle size={16} />}
                >
                  Connect
                </Button>
              </div>
              
              <div className="glass-effect rounded-xl overflow-hidden">
                {wallets.map((wallet, index) => (
                  <div 
                    key={index}
                    className={`
                      p-4 flex justify-between items-center
                      ${index !== wallets.length - 1 ? 'border-b border-white/10' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-color/20 flex items-center justify-center">
                        {wallet.name === 'MetaMask' ? '🦊' : 
                         wallet.name === 'Phantom' ? '👻' : '🔗'}
                      </div>
                      <div>
                        <p className="font-medium">{wallet.name}</p>
                        {wallet.connected ? (
                          <p className="text-xs opacity-70">
                            {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
                          </p>
                        ) : (
                          <p className="text-xs text-yellow-500">Not connected</p>
                        )}
                      </div>
                    </div>
                    
                    {wallet.connected ? (
                      <div className="flex items-center gap-2">
                        {wallet.primary && (
                          <span className="text-xs bg-primary-color text-white rounded-full px-2 py-0.5">
                            Primary
                          </span>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                        >
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'privacy':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Privacy Settings</h3>
              <div className="glass-effect rounded-xl overflow-hidden">
                {[
                  { label: 'Show wallet balance to contacts', enabled: false },
                  { label: 'Display NFT collection publicly', enabled: true },
                  { label: 'Allow transaction history sharing', enabled: false },
                  { label: 'Hide wallet address in profile', enabled: true },
                  { label: 'Enable read receipts', enabled: true },
                ].map((item, index, arr) => (
                  <div 
                    key={index}
                    className={`
                      p-4 flex justify-between items-center
                      ${index !== arr.length - 1 ? 'border-b border-white/10' : ''}
                    `}
                  >
                    <span>{item.label}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={item.enabled}
                        onChange={() => {}}
                      />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-primary-color peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'about':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary-color/20 flex items-center justify-center mb-3">
                <MessageSquare size={32} className="text-primary-color" />
              </div>
              <h3 className="text-xl font-bold">3lite Messenger</h3>
              <p className="opacity-70">Version 1.0.0</p>
            </div>
            
            <div className="glass-effect rounded-xl overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <h4 className="font-medium mb-2">About 3lite</h4>
                <p className="text-sm opacity-70">
                  3lite Messenger is a Web3-native messaging platform that combines secure 
                  communication with seamless digital asset transfer capabilities.
                </p>
              </div>
              
              <div className="p-4 border-b border-white/10">
                <h4 className="font-medium mb-2">Contact Support</h4>
                <p className="text-sm opacity-70 mb-2">
                  Having issues or questions about 3lite Messenger?
                </p>
                <Button variant="outline" size="sm" fullWidth>
                  Contact Support
                </Button>
              </div>
              
              <div className="p-4">
                <Button variant="ghost" size="sm" fullWidth className="text-red-400 hover:text-red-500">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-64 w-full">
            <div className="glass-effect rounded-xl overflow-hidden">
              {[
                { id: 'appearance', label: 'Appearance', icon: <Palette size={20} /> },
                { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
                { id: 'wallets', label: 'Wallets', icon: <Wallet size={20} /> },
                { id: 'privacy', label: 'Privacy', icon: <Shield size={20} /> },
                { id: 'about', label: 'About', icon: <Info size={20} /> },
              ].map((item) => (
                <button
                  key={item.id}
                  className={`
                    w-full flex items-center gap-3 p-4 text-left
                    hover:bg-hover-bg border-b border-white/10 last:border-0
                    ${activeTab === item.id ? 'bg-primary-color/10' : ''}
                  `}
                  onClick={() => setActiveTab(item.id as SettingsTab)}
                >
                  <span className={activeTab === item.id ? 'text-primary-color' : ''}>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
              
              <button className="w-full flex items-center gap-3 p-4 text-left text-red-400 hover:bg-hover-bg hover:text-red-500">
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Missing imports
import { MessageSquare, Palette, PlusCircle } from 'lucide-react';

export default Settings;