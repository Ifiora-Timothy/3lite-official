"use server";
import dbConnect from "@/lib/db/dbConnect";
import { Chat } from "@/lib/db/models/chat";
import { Message } from "@/lib/db/models/message";
import { User } from "@/lib/db/models/user";
import { escapeRegex } from "@/lib/utils/helpers";
import { cache } from "react"; // Import React's cache function
import { UserDetails } from "../../types";

export const getUsersFromRegex = async (regex: string) => {
  await dbConnect();
  const filteredTest = escapeRegex(regex);
  const resp = await User.getUsersFromRegex({ regex: filteredTest });

  return JSON.stringify(resp);
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

// Cache the getChats function to avoid unnecessary fetches
export const getChats = cache(async (userId: string): Promise<string> => {
  await dbConnect();
  try {
    const chats = await Chat.getChats({ userId });
    return JSON.stringify(chats);
  } catch (err) {
    console.error({ err });
    throw new Error("No chats found");
  }
});

// Cache the getChat function to avoid unnecessary fetches when switching between users
export const getChat = cache(
  async (userId: string, user2Id: string): Promise<string> => {
    await dbConnect();
    try {
      const chat = await Chat.getChat({ userId, user2Id });

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
}: {
  chatId: string | null;
  sender: string;
  id: string;
  receiver: string;
  createdAt: Date;
  message: string;
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
  });
  return JSON.stringify(resp);
};
