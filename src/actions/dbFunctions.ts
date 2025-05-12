"use server";
import dbConnect from "@/lib/db/dbConnect";
import { Chat, IChat, IPopulatedChat } from "@/lib/db/models/chat";
import { Message } from "@/lib/db/models/message";
import { Iuser, User } from "@/lib/db/models/user";
import { escapeRegex } from "@/lib/utils/helpers";
import { cache } from "react"; // Import React's cache function
import { group, UserDetails } from "../types";
import { Chat as TChat } from "@/types";

export const getUsersFromRegex = async (regex: string) => {
  await dbConnect();


  const filteredTest = escapeRegex(regex);
  const resp = await User.getUsersFromRegex({ regex: filteredTest });
  if (!resp || resp.length === 0) {
    throw new Error("No users found");
  }
  const users:TChat[] = resp.map((user) => {
    return {
      _id: user._id,
      username: user.username,
      avatar: user.avatar || "", // Provide default empty string if avatar is undefined
      lastMessage: "no chat yet",
      walletAddress: user.walletAddress,
      type: "private" as const,
      updatedAt: new Date().toISOString(),
      status: user.status,
      unreadCount: 0,
      pinned:false
    };
  });


  return JSON.stringify(users);
};

export async function createUser({
  username,
  walletAddress,
  walletType,
  connectionTimestamp,
  avatar,
}: {
  username: string;
  walletAddress: string;
  walletType: string;
  connectionTimestamp: Date;
  avatar?: string;
}): Promise<string> {
  await dbConnect();
  const user = await User.createUser({
    username,
    walletAddress,
    walletType,
    connectionTimestamp,
    avatar,
  });

  let userDetails: UserDetails = {
    _id: user._id,
    username: user.username,
    walletAddress: user.walletAddress,
    avatar: user.avatar,
    walletType: user.walletType,
    connectionTimestamp,
    status: user.status,
    pinnedChats: user.pinnedChats.map((chat) => chat.toString()),
  };

  return JSON.stringify(userDetails);
}

export const getUserByWalletAddress = async (
  walletAddress: string
): Promise<string | null> => {
  await dbConnect();
  try {
    const user = await User.findByWalletAddress(walletAddress);
    if (!user) {
      throw new Error("No user found");
    }

    return JSON.stringify(user);
  } catch (err) {
    console.error({ err });
    return null;
  }
};

export const createChat = async ({
  senderId,
  receiverId,
}: {
  senderId: string;
  receiverId: string;
}) => {
  await dbConnect();
  const chat = await Chat.createChat({
    type: "private",
    participants: [senderId, receiverId],
  });
  return JSON.stringify(chat);
};
export const createGroupChat = async ({
  groupDetails,
  participants,
}: {
  groupDetails: group;
  participants: Array<string>;
}) => {
  await dbConnect();
  const chat = await Chat.createGroupChat({
    type: "group",
    groupDetails,
    participants,
  });
  return JSON.stringify(chat);
};

// Cache the getChats function to avoid unnecessary fetches
export const getChats = cache(async (userId: string): Promise<string> => {
  await dbConnect();
  try {
    let parsedChats: TChat[] = [];
    const chats = await Chat.getChats({ userId });
    if (!chats || chats.length === 0) {
      throw new Error("No chats found");
    }
    
   
    const groupChats = chats.filter(
      (chat) => chat.type === "group" && chat.participants.length > 2
    );
    const personalChats = chats.filter(
      (chat) => chat.type === "private" && chat.participants.length === 2
    );
    const renderedGroupChats = groupChats.map((groupChat) => {
      if (!groupChat.groupDetails) {
        throw new Error("Group details are missing");
      }
      return {
        _id: groupChat._id,
        username: groupChat.groupDetails.groupName,
        avatar: groupChat.groupDetails.groupAvatar || "", // Provide default empty string if avatar is undefined
        lastMessage: groupChat.lastMessage?.content ?? "no chat yet",
        walletAddress: groupChat.groupDetails.groupDescription || "",
        type: "group" as const,
        updatedAt: groupChat.updatedAt.toISOString(),
        status: "online" as const,
        unreadCount: groupChat.unreadCount,
        pinned: false,
      };
    }
    );
    const renderedPersonalChats = personalChats.map((personalChat) => {
      const otherParticipant = personalChat.participants.find(
        (participant) => participant._id.toString() !== userId
      )!;
    

      return {
        _id: otherParticipant._id,
        username: otherParticipant.username,
        avatar: otherParticipant.avatar || "", // Provide default empty string if avatar is undefined
        lastMessage: personalChat.lastMessage?.content ?? "no chat yet",
        walletAddress: otherParticipant.walletAddress,
        type: "private" as const,
        updatedAt: personalChat.updatedAt.toISOString(),
        status: otherParticipant.status,
        unreadCount: personalChat.unreadCount,
        pinned:
          otherParticipant.pinnedChats?.some(
            (chatId) => chatId.toString() === personalChat._id.toString()
          ) ?? false,
      };
    });
    // parsedChats = [...renderedGroupChats, ...renderedPersonalChats];
  // sort the final chats by updatedAt
    parsedChats = [...renderedGroupChats, ...renderedPersonalChats].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );


    // unpopulate the participants and groupDetails fields 


    return JSON.stringify(parsedChats);
  } catch (err) {
    console.error({ err });
    throw new Error("No chats found");
  }
});

// Cache the getChat function to avoid unnecessary fetches when switching between users
export const getChat = cache(
  async (
    type: "private" | "group" | "ai",
    userId: string,
    user2Id: string
  ): Promise<string> => {
    await dbConnect();
    try {
      let chat: IChat = {} as IChat;
      if (type === "private") {
        chat = await Chat.getChat({ userId, user2Id });
       } else {
        chat = await Chat.getGroupChat({ chatId: user2Id });
      }

      return JSON.stringify(chat);
    } catch (err) {
      console.error({ err });
      throw new Error("No chats found");
    }
  }
);

export const getUserIdFromUsername = cache(
  async (username: string): Promise<string> => {
    await dbConnect();
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("User not found");
    }
    return user._id.toString();
  }
);

// Cache the getChatMessages function
export const getChatMessages = cache(
  async (chatId: string): Promise<string> => {
    await dbConnect();
    const chats = await Message.getMessages({ chatId });
    return JSON.stringify(chats);
  }
);

export const addMessage = async ({
  chatId,
  id,
  sender,
  receiver,
  createdAt,
  message,
  type,
}: {
  chatId: string | null;
  sender: string;
  id: string;
  receiver: string;
  createdAt: Date;
  message: string;
  type: "private" | "group" | "ai";
}) => {
  await dbConnect();
  const resp = await Message.addMessage({
    chatId,
    sender,
    id,
    createdAt,
    receiver,
    content: message,
    contentType: "text",
    type,
  });
  return JSON.stringify(resp);
};
