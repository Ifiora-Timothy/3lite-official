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
