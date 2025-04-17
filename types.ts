export type UserDetails = {
  _id: string;
  username: string;
  walletAddress: string;
  lastMessage?: string;
  avatar: string;
  walletType: string;
  connectionTimestamp?: Date;
};

export interface IMessage {
  _id: string;
  tempId?: string;
  content: string;
  sender: {
    _id: string;
    username: string;
    walletAddress: string;
    avatar?: string;
    status?: string;
  };
  contentType: string;
  receiver: {
    _id: string;
    username: string;
    walletAddress: string;
    avatar?: string;
    status?: string;
  };
  createdAt: Date;
  deliveryStatus?: "sending" | "sent" | "failed";
}

export type TactiveUser = {
  _id: string;
  username: string;
  avatar: string;
  lastMessage: string;
  walletAddress: string;
};
