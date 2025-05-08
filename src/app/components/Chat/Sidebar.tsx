import React from 'react';
import { MessageSquare, User, Briefcase, Brain, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Logo from '@/app/UI/Logo';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: 'chat' | 'profile' | 'assets' | 'ai' | 'settings') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="h-screen w-16 glass-effect flex flex-col items-center py-6 border-r border-white/10">
      <div className="mb-8">
        <Logo size={32} />
      </div>

      <nav className="flex-1 flex flex-col items-center justify-center gap-8">
        <button
          className={`navigation-icon p-2 rounded-lg ${currentView === 'chat' ? 'active bg-primary-color/10' : ''}`}
          onClick={() => onViewChange('chat')}
          aria-label="Chats"
        >
          <MessageSquare size={20} />
        </button>

        <button
          className={`navigation-icon p-2 rounded-lg ${currentView === 'profile' ? 'active bg-primary-color/10' : ''}`}
          onClick={() => onViewChange('profile')}
          aria-label="Profile"
        >
          <User size={20} />
        </button>

        <button
          className={`navigation-icon p-2 rounded-lg ${currentView === 'assets' ? 'active bg-primary-color/10' : ''}`}
          onClick={() => onViewChange('assets')}
          aria-label="Assets"
        >
          <Briefcase size={20} />
        </button>

        <button
          className={`navigation-icon p-2 rounded-lg ${currentView === 'ai' ? 'active bg-primary-color/10' : ''}`}
          onClick={() => onViewChange('ai')}
          aria-label="AI Agent"
        >
          <Brain size={20} />
        </button>

        <button
          className={`navigation-icon p-2 rounded-lg ${currentView === 'settings' ? 'active bg-primary-color/10' : ''}`}
          onClick={() => onViewChange('settings')}
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
      </nav>

      <div className="mt-auto flex flex-col gap-4">
      <button 
          className="p-2 rounded-lg text-red-400 hover:text-red-500 transition-all duration-200" 
          aria-label="Logout"
        >
          <LogOut size={20} />
        </button>
        <button
          className="p-2 rounded-lg transition-all duration-200 hover:text-yellow-400"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
  
      </div>
    </aside>
  );
};

export default Sidebar;