
import React, { useState, useEffect } from 'react';
import { MessageSquare, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import WalletConnectionHandler from './WalletConnectModel';
// import WalletConnectionHandler from './WalletButton';
// import WalletConnectionHandler from './WalletButton';


const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare
              className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-2"
              strokeWidth={2}
            />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              3lite Messenger
            </span>
          </div>
          <div style={{
             color: "var(--text-color)",
          }} className="hidden md:flex space-x-8">
            <a
              href="#features"
              className=" hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className=" hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              How It Works
            </a>
            <a
              href="#why-3lite"
              className=" hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              Why 3lite?
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme =="dark" ? (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <div
           className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2  rounded-full font-medium hover:shadow-lg hover:opacity-90 transition-all'
              
            >
            <WalletConnectionHandler/>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;