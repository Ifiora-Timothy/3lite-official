import {
  database,
  ref,
  set,
  onValue,
  remove,
  get,
  update,
} from "../lib/db/firebase";
import { IChat } from "../lib/db/models/chat";

import type { DataSnapshot } from "firebase/database";
import { IMessage } from "../types";
import { Chat } from "@/types";

export class FirebaseChat {
  static async syncMessage(message: IMessage) {
    
    const sanitizedMessage: any = {
      _id: message._id.toString(),
      chat: message.chat.toString(),
      sender: {
        _id: message.sender._id.toString(),
        username: message.sender.username,
        walletAddress: message.sender.walletAddress,
        avatar: message.sender.avatar || null,
        status: message.sender.status || null,
      },

      content: message.content,
      contentType: message.contentType,
      createdAt: message.createdAt.getTime(), // Convert Date to createdAt for Firebase
      deliveryStatus: message.deliveryStatus,
      receiverType: message.receiverType, // Include the receiverType
    };
    // Handle receiver based on receiverType
    if (message.receiverType === "Chat") {
      // For group chats, include the group details
      sanitizedMessage.receiver = {
        _id: message.receiver._id.toString(),
        // Include group details if available
        ...(message.receiver.groupName && {
          groupDetails: {
            groupName: message.receiver.groupName || null,
            groupAvatar: message.receiver.groupAvatar || null,
            groupDescription: message.receiver.groupDescription || null,
          },
        }),
      };
    } else {
      // For user chats
      sanitizedMessage.receiver = {
        _id: message.receiver._id.toString(),
        username: message.receiver.username,
        walletAddress: message.receiver.walletAddress,
        avatar: message.receiver.avatar || null,
        status: message.receiver.status || null,
      };
    }
    const chatRef = ref(
      database,
      `chats/${message.chat}/messages/${message._id.toString()}`
    );
    await set(chatRef, sanitizedMessage);
  }

  static async syncChat(chat: IChat) {
    
    const chatRef = ref(database, `chats/${chat._id.toString()}/info`);
    //consrvert object ids to strings
    const sanitizedChat: any = {
      type: chat.type.toString(),
      contractAddress: chat.contractAddress
        ? chat.contractAddress.toString()
        : null,
      _id: chat._id.toString(),
      messages: chat.messages.map((m) => m.toString()),
      lastMessage: chat.lastMessage ? chat.lastMessage.toString() : null,
      participants: chat.participants.map((p) => p.toString()),
      createdAt: chat.createdAt.getTime(),
      updatedAt: chat.updatedAt.getTime(),
    };
    // Include groupDetails if this is a group chat
    if (chat.type === "group" && chat.groupDetails) {
      sanitizedChat.groupDetails = {
        groupName: chat.groupDetails.groupName || null,
        groupAvatar: chat.groupDetails.groupAvatar || null,
        groupDescription: chat.groupDetails.groupDescription || null,
      };
    }
    await set(chatRef, sanitizedChat);
  }

static async addUserToChat(userId: string, chatId: string,lastMessageTimestamp: Date) {
 
  const userChatRef = ref(database, `userChats/${userId}/${chatId}`);
  await set(userChatRef, Number(lastMessageTimestamp));
  
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


static subscribeToUserChats(userId: string, callback: (chats: Chat[]) => void) {
  // Create a reference to a user-chats mapping in Firebase
  // This assumes you maintain a structure that tracks which chats each user belongs to
 
  const userChatsRef = ref(database, `userChats/${userId}`);
  
  // Listen for any changes to the user's chat list
  return onValue(userChatsRef, (snapshot: DataSnapshot) => {
    const chatIds: string[] = [];
    const chats: Record<string, Chat> = {};
    let pendingChats = 0;
    
    
    // If no chats found for this user
    if (!snapshot.exists() || snapshot.val() === null) {
      callback([]);
      return;
    }
    
    
    // Get all chatIds this user is part of
    snapshot.forEach((childSnapshot: DataSnapshot) => {
      const chatId = childSnapshot.key;
      if (chatId) chatIds.push(chatId);
    });
    
    if (chatIds.length === 0) {
      callback([]);
      return;
    }
    
    // For each chatId, get the chat info
    chatIds.forEach((chatId) => {
      pendingChats++;
      const chatInfoRef = ref(database, `chats/${chatId}/info`);
      
      // Get chat details
      get(chatInfoRef).then((chatSnapshot) => {
        if (chatSnapshot.exists()) {
          
          const chatInfo = chatSnapshot.val();
          chats[chatId] = chatInfo;
        }
        
        pendingChats--;
        if (pendingChats === 0) {
          // All chats loaded, sort by most recent first
          const chatArray = Object.values(chats);
          callback(
            chatArray.sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt))
          );
        }
      });
    });
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
static async syncHistoricalData(messages: Array<IMessage>, chatId: string) {
  try {
    // First, fetch all existing messages in Firebase for this chat
    const chatMessagesRef = ref(database, `chats/${chatId}/messages`);
    const existingMessagesSnapshot = await get(chatMessagesRef);
    const existingMessages = existingMessagesSnapshot.exists() ? existingMessagesSnapshot.val() : {};
    
    // Create a set of message IDs from the input array for easy lookup
    const messageIdsSet = new Set(messages.map(msg => msg._id.toString()));
    
    // Remove messages that exist in Firebase but not in the input array
    if (existingMessagesSnapshot.exists()) {
      const messagesToRemove = Object.keys(existingMessages).filter(
        messageId => !messageIdsSet.has(messageId)
      );
      
      
      
      // Delete each message that's not in the input array
      for (const messageId of messagesToRemove) {
        const messageToRemoveRef = ref(database, `chats/${chatId}/messages/${messageId}`);
        await remove(messageToRemoveRef);
        
      }
    }

    // Now process the input messages as before
    for (const message of messages) {
      const sanitizedMessage: any = {
        _id: message._id.toString(),
        chat: message.chat.toString(),
        sender: {
          _id: message.sender._id.toString(),
          username: message.sender.username,
          walletAddress: message.sender.walletAddress,
          avatar: message.sender.avatar || null,
          status: message.sender.status || null,
        },
        content: message.content,
        contentType: message.contentType,
        createdAt: message.createdAt, // Convert Date to timestamp for Firebase
        deliveryStatus: message.deliveryStatus,
        receiverType: message.receiverType, // Include the receiverType
      };

      // Handle receiver based on receiverType
      if (message.receiverType === "Chat") {
        // For group chats, include the group details
        sanitizedMessage.receiver = {
          _id: message.receiver._id.toString(),
          // Include group details if available
          ...(message.receiver.groupName && {
            groupDetails: {
              groupName: message.receiver.groupName || null,
              groupAvatar: message.receiver.groupAvatar || null,
              groupDescription: message.receiver.groupDescription || null,
            },
          }),
        };
      } else {
        // For user chats
        sanitizedMessage.receiver = {
          _id: message.receiver._id.toString(),
          username: message.receiver.username,
          walletAddress: message.receiver.walletAddress,
          avatar: message.receiver.avatar || null,
          status: message.receiver.status || null,
        };
      }

      // Add each message to Firebase
      const messageRef = ref(
        database,
        `chats/${chatId}/messages/${message._id.toString()}`
      );

      // check if there is a difference between the current message and the new message
      const currentMessageSnapshot = await get(messageRef);

      if (!currentMessageSnapshot.exists() || JSON.stringify(currentMessageSnapshot.val()) !== JSON.stringify(sanitizedMessage)) {
        await set(messageRef, sanitizedMessage);
      }
      else {
        
      }
    }

    return messages;
  } catch (error) {
    console.error("Error syncing historical data:", error);
    throw error;
  }
}
}
