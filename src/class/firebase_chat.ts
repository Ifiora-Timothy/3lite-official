import {
  IMessage,
  IpopulatedMessageContent,
  Message,
} from "../lib/db/models/message";
import {
  database,
  ref,
  set,
  onValue,
  push,
  remove,
  get,
  update,
} from "../lib/db/firebase";
import { IChat } from "../lib/db/models/chat";

import type { DataSnapshot } from "firebase/database";
import { getChatMessages } from "@/actions/dbFunctions";

type TMessage = {
  _id: string;
  chat: string;
  sender: {
    _id: string;
    username: string;
    walletAddress: string;
    avatar?: string;
    status?: string;
  };
  receiver: {
    _id: string;
    username: string;
    walletAddress: string;
    avatar?: string;
    status?: string;
  };
  content: string;
  contentType: string;
  createdAt: Date;
  deliveryStatus: string;
};

export class FirebaseChat {
  static async syncMessage(message: TMessage) {
    console.log("syncing message", message);
    const sanitizedMessage = {
      _id: message._id.toString(),
      chat: message.chat.toString(),
      sender: {
        _id: message.sender._id.toString(),
        username: message.sender.username,
        walletAddress: message.sender.walletAddress,
        avatar: message.sender.avatar || null,
        status: message.sender.status || null,
      },
      receiver: {
        _id: message.receiver._id.toString(),
        username: message.receiver.username,
        walletAddress: message.receiver.walletAddress,
        avatar: message.receiver.avatar || null,
        status: message.receiver.status || null,
      },
      content: message.content,
      contentType: message.contentType,
      createdAt: message.createdAt.getTime(), // Convert Date to createdAt for Firebase
      deliveryStatus: message.deliveryStatus,
    };

    const chatRef = ref(
      database,
      `chats/${message.chat}/messages/${message._id.toString()}`
    );
    await set(chatRef, {
      ...sanitizedMessage,
      createdAt: message.createdAt.getTime(), // Convert Date to createdAt for Firebase
    });
  }

  static async syncChat(chat: IChat) {
    console.log({ chat: `chats/${chat._id.toString()}/info` });
    const chatRef = ref(database, `chats/${chat._id.toString()}/info`);
    //consrvert object ids to strings
    const sanitizedChats = {
      type: chat.type.toString(),
      contractAddress: chat.contractAddress
        ? chat.contractAddress.toString()
        : null,
      _id: chat._id.toString(),
      messages: chat.messages.map((m) => m.toString()),
      lastMessage: chat.lastMessage ? chat.lastMessage.toString() : null,
      participants: chat.participants.map((p) => p.toString()),
    };
    await set(chatRef, {
      ...sanitizedChats,
      createdAt: chat.createdAt.getTime(),
      updatedAt: chat.updatedAt.getTime(),
      lastMessage: sanitizedChats.lastMessage ? chat.lastMessage : null,
    });
  }

  static subscribeToChat(
    chatId: string,
    callback: (messages: IMessage[]) => void
  ) {
    const chatRef = ref(database, `chats/${chatId.toString()}/messages`);
    return onValue(chatRef, (snapshot: DataSnapshot) => {
      const messages: IMessage[] = [];
      snapshot.forEach((childSnapshot: DataSnapshot) => {
        const message = childSnapshot.val();
        messages.push({
          ...message,
          createdAt: new Date(message.createdAt),
        });
      });
      callback(
        messages.sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime())
      );
    });
  }
  static checkIfDataExists = async (chatId: string) => {
    const chatRef = ref(database, `chats/${chatId}/messages`);
    const snapshot = await get(chatRef);
    return snapshot.exists();
  };

  static subscribeToUserChats(
    userId: string,
    callback: (chats: IChat[]) => void
  ) {
    const userChatsRef = ref(database, "chats");
    return onValue(userChatsRef, (snapshot) => {
      const chats: IChat[] = [];
      snapshot.forEach((childSnapshot) => {
        const chat = childSnapshot.child("info").val();

        if (
          chat &&
          chat.participants.some((p: any) => p.toString() === userId.toString())
        ) {
          chats.push({
            ...chat,
            createdAt: new Date(chat.createdAt),
            updatedAt: new Date(chat.updatedAt),
            lastMessage: chat.lastMessage
              ? {
                  ...chat.lastMessage,
                  createdAt: new Date(chat.lastMessage.createdAt),
                }
              : undefined,
          });
        } else {
        }
      });
      callback(
        chats.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      );
    });
  }
  static async deleteMessage(chatId: string, messageId: string) {
    const messageRef = ref(database, `chats/${chatId}/messages/${messageId}`);
    await remove(messageRef);
  }
  static async deleteAllMessages() {
    await set(ref(database), null);
  }

  static async editMessage(
    chatId: string,
    messageId: string,
    newContent: string
  ) {
    const messageRef = ref(database, `chats/${chatId}/messages/${messageId}`);
    await update(messageRef, {
      content: newContent,
      edited: true,
      editedAt: new Date().getTime(),
    });
  }

  static subscribeToTyping(chatId: string, callback: (typing: any[]) => void) {
    const typingRef = ref(database, `typing/${chatId}`);
    return onValue(typingRef, (snapshot) => {
      const typing: any[] = [];
      snapshot.forEach((childSnapshot) => {
        typing.push({
          userId: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      callback(typing);
    });
  }

  static subscribeToPresence(
    userIds: string[],
    callback: (presence: Record<string, any>) => void
  ) {
    const presenceRef = ref(database, "presence");
    return onValue(presenceRef, (snapshot) => {
      const presence: Record<string, any> = {};
      userIds.forEach((userId) => {
        const userPresence = snapshot.child(userId.toString()).val();
        presence[userId.toString()] = userPresence || { status: "offline" };
      });
      callback(presence);
    });
  }
  static async syncHistoricalData(
    messages: Array<IpopulatedMessageContent>,
    chatId: string
  ) {
    try {
      // Fetch messages from MongoDB for the given chat

      console.log("from historic", messages);

      for (const message of messages) {
        const sanitizedMessage = {
          _id: message._id.toString(),
          chat: message.chat.toString(),
          sender: {
            _id: message.sender._id.toString(),
            username: message.sender.username,
            walletAddress: message.sender.walletAddress,
            avatar: message.sender.avatar,
            status: message.sender.status,
          },
          receiver: {
            _id: message.receiver._id.toString(),
            username: message.receiver.username,
            walletAddress: message.receiver.walletAddress,
            avatar: message.receiver.avatar,
            status: message.receiver.status,
          },
          content: message.content,
          contentType: message.contentType,
          createdAt: message.createdAt,
          deliveryStatus: message.deliveryStatus,
        };

        // Sync each message to Firebase
        const messageRef = ref(
          database,
          `chats/${chatId}/messages/${message._id}`
        );
        await set(messageRef, sanitizedMessage);
      }

      return messages;
    } catch (error) {
      console.error("Error syncing historical data:", error);
      throw error;
    }
  }
}
