"use server";
import dbConnect from "@/lib/db/dbConnect";
import { Chat } from "@/lib/db/models/chat";
import { Message } from "@/lib/db/models/message";
import { User } from "@/lib/db/models/user";
import { escapeRegex } from "@/lib/utils/helpers";
import { cache } from "react"; // Import React's cache function

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

  return JSON.stringify({
    _id: user._id,
    username: user.username,
    walletAddress: user.walletAddress,
    avatar: user.avatar,
    walletType: user.walletType,
  });
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
    console.log({ err });
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
  console.log({ chat }, "chat created");
  return JSON.stringify(chat);
};

// Cache the getChats function to avoid unnecessary fetches
export const getChats = cache(async (userId: string): Promise<string> => {
  await dbConnect();
  try {
    const chats = await Chat.getChats({ userId });
    return JSON.stringify(chats);
  } catch (err) {
    console.log({ err });
    throw new Error("No chats found");
  }
});

// Cache the getChat function to avoid unnecessary fetches when switching between users
export const getChat = cache(
  async (userId: string, user2Id: string): Promise<string> => {
    await dbConnect();
    try {
      const chat = await Chat.getChat({ userId, user2Id });
      console.info({ chat, messages: chat.messages });
      return JSON.stringify(chat);
    } catch (err) {
      console.log({ err });
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
  console.log("adding message");
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
