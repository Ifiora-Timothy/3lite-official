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

const ChatsSidebar = () => {
  const { setActiveUser } = useChatContext();
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
      console.log({ users });
      if (!user?._id) {
        setIsFetching(false);
        setSearchResults([]);
        return;
      }

      const parsedUsers = JSON.parse(users).filter(
        (thisUser: { _id: { toString: () => string } }) =>
          thisUser._id.toString() !== user._id
      );
      console.log({
        userId: user._id,

        parsedUsers,
      });

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
    if (!user?._id) return;
    try {
      setIsFetching(true);
      console.log("user", user);
      const chats = await getChats(user?._id);
      const parsedChats: IPopulatedChat[] = JSON.parse(chats);
      console.log("parsedChats", parsedChats);

      if (parsedChats.length > 0) {
        const otherParticipant = parsedChats[0].participants.filter(
          (participant) => participant._id !== user._id
        )[0];

        setActiveUser({
          _id: otherParticipant._id,
          username: otherParticipant.username,
          avatar: otherParticipant.avatar || "",
          walletAddress: otherParticipant.walletAddress,
          lastMessage: parsedChats[0].lastMessage?.content ?? "no chat yet",
        });
      }

      setCurrChats(parsedChats);
    } catch (error) {
      console.error("Error fetching chats:", error);
      setError("Failed to load chats");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      getAllChats();
    }
  }, [user?._id]);

  const groupChats = currChats.filter(
    (chat) => chat.type === "group" && chat.participants.length > 2
  );
  const personalChats = currChats.filter(
    (chat) => chat.type === "private" && chat.participants.length === 2
  );

  let renderedGroupChats,
    renderedPersonalChats: {
      _id: string;
      username: string;
      avatar: string;
      lastMessage: string;
      walletAddress: string;
    }[];
  if (searchQuery.length <= 2) {
    renderedGroupChats = groupChats;
    renderedPersonalChats = personalChats.map((personalChat) => {
      const otherParticipant = personalChat.participants.find(
        (participant) => participant._id !== user?._id
      )!;
      return {
        _id: otherParticipant._id,
        username: otherParticipant.username,
        avatar: otherParticipant.avatar || "", // Provide default empty string if avatar is undefined
        lastMessage: personalChat.lastMessage?.content ?? "no chat yet",
        walletAddress: otherParticipant.walletAddress,
      };
    });
  } else {
    renderedPersonalChats = searchResults.map((user) => {
      // if  we already have the user in our chats, we don't want to return themso we can access the last message
      const existingChat = personalChats.find((chat) =>
        chat.participants.some((participant) => participant._id === user._id)
      );
      console.log("existingChat", user);
      if (existingChat) {
        return {
          _id: user._id,
          username: user.username,
          avatar: user.avatar,
          lastMessage: existingChat.lastMessage?.content ?? "no chat yet",
          walletAddress: user.walletAddress,
        };
      }
      return {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        lastMessage: user.lastMessage || "no chat yet",
        walletAddress: user.walletAddress,
      };
    });
  }
  console.log("searchResults", searchResults, "personalChats", personalChats);

  return (
    <div className="pt-5  h-full flex flex-col  border-r">
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
            {groupChats.length > 0 ? (
              groupChats.map((groupChat) => {
                if (!groupChat.groupDetails?.groupName) return null;
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
