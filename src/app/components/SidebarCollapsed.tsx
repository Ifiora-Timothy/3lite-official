"use client";
import React from "react";
import {
  MessageSquare,
  User,
  Briefcase,
  Brain,
  Settings,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/app/contexts/ThemeContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const currentView = pathname.split("/")[1]; // Assuming the first segment of the path is the view name

  return (
    <aside className="h-full w-16  flex flex-col items-center py-6 border-r border-white/10">
      <nav className="flex-1 flex flex-col items-center justify-center gap-8">
        <Link
          className={`navigation-icon p-2 rounded-lg ${
            currentView === "chat" ? "active bg-primary-color/10" : ""
          }`}
          href="/chat"
          aria-label="Chats"
        >
          <MessageSquare size={20} />
        </Link>

        <Link
          className={`navigation-icon p-2 rounded-lg ${
            currentView === "profile" ? "active bg-primary-color/10" : ""
          }`}
          aria-label="Profile"
          href="/profile"
        >
          <User size={20} />
        </Link>

        <Link
          className={`navigation-icon p-2 rounded-lg ${
            currentView === "assets" ? "active bg-primary-color/10" : ""
          }`}
          aria-label="Assets"
          href="/dashboard"
        >
          <Briefcase size={20} />
        </Link>

        <Link
          className={`navigation-icon p-2 rounded-lg ${
            currentView === "ai" ? "active bg-primary-color/10" : ""
          }`}
          aria-label="AI Agent"
          href="/ai-agent"
        >
          <Brain size={20} />
        </Link>

        <Link
          className={`navigation-icon p-2 rounded-lg ${
            currentView === "settings" ? "active bg-primary-color/10" : ""
          }`}
          aria-label="Settings"
          href="/settings"
        >
          <Settings size={20} />
        </Link>
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        <button
          className="p-2 rounded-lg transition-all duration-200 hover:text-yellow-400"
          onClick={toggleTheme}
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button
          className="p-2 rounded-lg text-red-400 hover:text-red-500 transition-all duration-200"
          aria-label="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
