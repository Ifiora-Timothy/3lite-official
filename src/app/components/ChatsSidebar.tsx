"use client";
import { useEffect, useState } from "react";
import { useChatContext } from "../hooks/useChatContext";
import { getChats, getUsersFromRegex } from "@/actions/dbFunctions";
import { useDebouncedCallback } from "use-debounce";
import CustomIcon from "./ui/CustomIcon";
import GroupComponent from "./ui/GroupComponent";
import PersonalComponent from "./ui/PersonalComponent";
import { UserDetails } from "../../../types";
import { IPopulatedChat } from "@/lib/db/models/chat";
import EmptyGroupChats from "./ui/EmptyGroupChat";
import ChatSearch from "./ChatSearch";
import useAuth from "../hooks/useAuth";
import { getPersonalandGroupChats } from "@/lib/utils/helpers";

const ChatsSidebar = () => {
  const { setActiveUser,getAllChats:getFullChat} = useChatContext();
  const { activeUser: user } = useAuth();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<UserDetails[]>([]);
  const [currChats, setCurrChats] = useState<IPopulatedChat[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
    } catch (error:any) {
      console.error("Error fetching chats:", error);
      setError(error.message);
    } 
    finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      getAllChats();
    }
  }, [user?._id]);



  let [renderedGroupChats,renderedPersonalChats] =getPersonalandGroupChats(currChats,searchQuery,searchResults,user);
  return (
    <div className="pt-5    h-full flex flex-col ">
      <div className="px-5 ">
        <ChatSearch handleType={handleType} />
      </div>
      <div className="mt-5  h-full overflow-y-auto  custom-scrollbar">
        <div className="">
          <div className="head px-5 mb-3">
            <div className="self-stretch  w-full inline-flex justify-between items-center">
              <div className="justify-start text-primary-foreground text-xs font-normal font-['Plus_Jakarta_Sans'] tracking-wide">
                GROUP MESSAGES
              </div>
              <div className="w-5 h-5 relative overflow-hidden">
                <CustomIcon name="more" className="" width={20} height={20} />
              </div>
            </div>
          </div>
          <div className="">
            {renderedGroupChats.length > 0 ? (
              renderedGroupChats.map((groupChat:any) => {
                if (!renderedGroupChats.groupDetails?.groupName) return null;
                return (
                  <GroupComponent
                    key={groupChat._id}
                    groupName={groupChat.groupDetails?.groupName}
                    pfp={groupChat.groupDetails?.groupAvatar}
                    lastMessage={groupChat.lastMessage!}
                    //   time={groupChat.updatedAt}
                    //   unreadCount={groupChat.unreadCount}
                  />
                );
              })
            ) : (
              <EmptyGroupChats />
            )}
          </div>
        </div>
        <div className="search mb-6 mt-2">
          <div className="head px-5 mb-1">
            <div className="self-stretch  w-full inline-flex justify-between items-center">
              <div className="justify-start text-primary-foreground text-xs font-normal font-['Plus_Jakarta_Sans'] tracking-wide">
                PERSONAL MESSAGES
              </div>
              <div className="w-5 h-5 relative overflow-hidden">
                <CustomIcon name="more" className="" width={20} height={20} />
              </div>
            </div>
          </div>
          <div className="">
            {renderedPersonalChats.map((personalChat) => {
              return (
                <PersonalComponent
                  user={personalChat}
                  lastMessage={personalChat.lastMessage}
                  setActiveUser={setActiveUser}
                  key={personalChat._id}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatsSidebar;
