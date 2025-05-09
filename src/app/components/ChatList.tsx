"use client";
import React, { useEffect, useState } from "react";
import { useChat } from "@/app/contexts/ChatContext";
import ChatListItem from "@/app/components/Chat/ChatListItem";
import Input from "../UI/Input";
import Button from "../UI/Button";
// Import for the no-conversations icon
import { MessageSquare } from "lucide-react";
import { useChatContext } from "../hooks/useChatContext";
import useAuth from "../hooks/useAuth";
import { UserDetails } from "../../../types";
import { IPopulatedChat } from "@/lib/db/models/chat";

import { getPersonalandGroupChats } from "@/lib/utils/helpers";
import { useDebouncedCallback } from "use-debounce";
import { getUsersFromRegex } from "@/actions/dbFunctions";

interface ChatListProps {
  onChatSelect: () => void;
}

const ChatList: React.FC<ChatListProps> = ({ onChatSelect }) => {
  const { getAllChats: getFullChat } = useChatContext();
  const { activeUser: user } = useAuth();
  const { chats, filterChats, searchChats } = useChat();

  // Move all useState declarations to the top
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<UserDetails[]>([]);
  const [currChats, setCurrChats] = useState<IPopulatedChat[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "pinned" | "ai" | "group"
  >("all");


  const getAllChats = async () => {
    setIsFetching(true);
    setError(null);

    try {
      const chats = await getFullChat();
      if (!chats) {
        setError("Failed to fetch chats");

        return;
      }

      setCurrChats(chats);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      getAllChats();
    } 
  }, [user?._id]);

  let [_renderedGroupChats, renderedPersonalChats] = getPersonalandGroupChats(
    currChats,
    searchQuery,
    searchResults,
    user
  );

  const handleFilterChange = (filter: "all" | "pinned" | "ai" | "group") => {
    setActiveFilter(filter);
    filterChats(filter);
  };

  const debounced = useDebouncedCallback(async (userRegex: string) => {
    setIsFetching(true);
    setError(null);

    try {
      const users = await getUsersFromRegex(userRegex);

      if (!user?._id) {
        setIsFetching(false);
        setSearchResults([]);
        return;
      }

      const parsedUsers = JSON.parse(users).filter(
        (thisUser: { _id: { toString: () => string } }) =>
          thisUser._id.toString() !== user._id
      );

      setSearchResults(parsedUsers);
    } catch (error) {
      console.error("Error searching users:", error);
      setError("Failed to search users");
    } finally {
      setIsFetching(false);
    }
  }, 300);

  const handleType = (userRegex: string) => {
    setSearchQuery(userRegex);
    if (userRegex.length < 3) {
      // setSearchResults([]);
      return;
    }
    debounced(userRegex);
  };


  return (
    <div className="w-full h-full   flex flex-col ">
      <div className="p-4 pt-0  flex flex-col gap-4">
        <Input
          variant="search"
          placeholder="Search conversations..."
          onChange={(e) => handleType(e.target.value)}
        />

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          <Button
            variant={activeFilter === "all" ? "primary" : "ghost"}
            size="sm"
            onClick={() => handleFilterChange("all")}
          >
            All
          </Button>
          <Button
            variant={activeFilter === "pinned" ? "primary" : "ghost"}
            size="sm"
            onClick={() => handleFilterChange("pinned")}
          >
            Pinned
          </Button>
          <Button
            variant={activeFilter === "ai" ? "primary" : "ghost"}
            size="sm"
            onClick={() => handleFilterChange("ai")}
          >
            AI
          </Button>
          <Button
            variant={activeFilter === "group" ? "primary" : "ghost"}
            size="sm"
            onClick={() => handleFilterChange("group")}
          >
            Group
          </Button>
        </div>
      </div>

      <div className="flex-1 w-full overflow-y-auto p-2">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="mb-4 p-4 rounded-full bg-primary-color/10">
              <MessageSquare className="text-primary-color" size={32} />
            </div>
            <h3 className="font-semibold text-lg mb-2">
              No conversations found
            </h3>
            <p className="text-sm opacity-70">
              Start a new chat or adjust your search filters
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {renderedPersonalChats.map((chat) => (
              <ChatListItem key={chat._id} chat={chat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
