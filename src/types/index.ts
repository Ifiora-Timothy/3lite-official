export interface Chat {
  _id: string;
  username: string;
  avatar?: string;
  lastMessage: string;
  walletAddress?: string;
  updatedAt: string;
  status: "online" | "offline";
  unreadCount: number;
  pinned: boolean;
  type: "private" | "group" | "ai";
}

export interface ChatMessage {
  id: string;
  chatId: string;
  sender: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  status?: "sending"|"sent" | "delivered" | "read" | "received";
  isAI: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  address: string;
  bio?: string;
}

export interface NFT {
  id: string;
  name: string;
  image: string;
  collection: string;
  owner: string;
}

export interface Token {
  symbol: string;
  name: string;
  balance: string;
  usdValue?: string;
}

export interface Transaction {
  id: string;
  type: "sent" | "received";
  amount: string;
  token: string;
  to?: string;
  from?: string;
  timestamp: string;
  status: "pending" | "completed" | "failed";
}


import mongoose from "mongoose";

export type UserDetails = {
  _id: string;
  username: string;
  walletAddress: string;
  lastMessage?: string;
  avatar?: string;
  walletType: string;
  connectionTimestamp?: Date;
  pinnedChats: string[];
  status: "online" | "offline";
};

export interface IMessage  {
  _id: string; // Unique identifier for the message
  tempId?: string; // Temporary ID for unsent messages
  chat: string; // ID of the chat this message belongs to
  sender: {
    _id: string;
    username: string;
    walletAddress: string;
    avatar?: string;
    status?: string;
  };
  receiverType: "User" | "Chat"; // Indicates if receiver is a user or a group

  receiver: {
    _id: string;
    username?: string; // For users
    walletAddress?: string; // For users
    groupName?: string; // For groups
    groupAvatar?: string; // For groups
    groupDescription?: string; // For groups
    avatar?: string;
    status?: string;
  };
  deliveredTo: Array<{
    _id: string;
    date: Date;
  }>; //Array of user IDs who have received the message
  readBy: Array<{
    _id: string;
    date: Date;
  }>; //Array of user IDs who have read the message
  content: string; // Actual content of the message
  contentType: "text" | "image" | "file"; // Type of content in the message
  deliveryStatus: "sending" | "sent" | "delivered" | "read"; // Current delivery status
  deliveredAt?: Date; // When the message was delivered
  readAt?: Date; // When the message was read
  createdAt: Date; // When the message was created
}

export type TactiveUser = {
  _id: string;
  username: string;
  avatar: string;
  lastMessage: string;
  walletAddress: string;
};
/**
 * Interface defining the structure for group chat details
 */
export interface group {
  groupName: string; // Name of the group
  groupAvatar?: string; // URL to the group's avatar image
  groupDescription?: string; // Text description of the group
  admins: Array<string>; // Array of user IDs who are admins of the group
}

export interface Igroup {
  groupName: string; // Name of the group
  groupAvatar?: string; // URL to the group's avatar image
  groupDescription?: string; // Text description of the group
  admins: Array<mongoose.Types.ObjectId>; // Array of user IDs who are admins of the group
}
/**
 * Interface defining the base structure of a chat document
 */
export interface IchatContent {
  _id: string; // Unique identifier for the chat
  type: "private" | "group"|"ai"; // Type of chat - either between two users or a group
  participants: Array<mongoose.Types.ObjectId>; // Array of user IDs participating in the chat
  messages: Array<mongoose.Types.ObjectId>; // Array of message IDs in this chat
  unreadCount: number; // Optional count of unread messages for this chat
  lastMessage?: mongoose.Types.ObjectId; // Reference to the most recent message (for preview/sorting)
  createdAt: Date; // When the chat was created
  updatedAt: Date; // When the chat was last updated
  groupDetails?: Igroup; // Group-specific details (only for group chats)
  contractAddress?: string; // Optional blockchain contract address (for on-chain functionality)

}

export type TGroupChat = {
  name:string;
  members: string[];
  groupAvatar?: string;
}
