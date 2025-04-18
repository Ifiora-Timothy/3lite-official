"use server";
import mongoose, { Model } from "mongoose";
import { Chat, ChatModel, IChat } from "./chat";
import { FirebaseChat } from "../../../class/firebase_chat";
import { User } from "./user";
import dbConnect from "../dbConnect";

/**
 * Interface defining the base structure of a message document
 */
export interface ImessageContent {
  _id: string; // Unique identifier for the message
  chat: mongoose.Types.ObjectId; // Reference to the chat this message belongs to
  sender: mongoose.Types.ObjectId; // User who sent the message
  receiver: mongoose.Types.ObjectId; // User who receives the message
  content: string; // Actual content of the message
  messageContentType: "text" | "image" | "file"; // Type of content in the message
  deliveryStatus: "sent" | "delivered" | "read"; // Current delivery status
  deliveredAt?: Date; // When the message was delivered
  readAt?: Date; // When the message was read
  transactionHash?: string; // Optional blockchain transaction hash
  blockchainStatus?: "pending" | "confirmed"; // Status of blockchain transaction if applicable
  createdAt?: Date; // When the message was created
}
export interface IpopulatedMessageContent {
  _id: string; // Unique identifier for the message
  chat: mongoose.Types.ObjectId; // Reference to the chat this message belongs to
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
  content: string; // Actual content of the message
  contentType: "text" | "image" | "file"; // Type of content in the message
  deliveryStatus: "sent" | "delivered" | "read"; // Current delivery status
  deliveredAt?: Date; // When the message was delivered
  readAt?: Date; // When the message was read
  createdAt: Date; // When the message was created
}

/**
 * Interface for the Message document with Mongoose Document properties
 */
export interface IMessage extends Document, ImessageContent {}

/**
 * Mongoose schema definition for Message documents
 */
const messageSchema = new mongoose.Schema<IMessage, MessageModel>(
  {
    // Reference to the chat this message belongs to
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true, // Indexed for faster queries
    },

    // User who sent the message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // User who receives the message
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Actual content of the message
    content: {
      type: String,
      required: true,
    },

    // Type of content (text, image, file)
    contentType: {
      type: String,
    },

    // Current delivery status
    deliveryStatus: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },

    // When the message was delivered
    deliveredAt: Date,

    // When the message was read
    readAt: Date,

    // Optional blockchain transaction hash
    transactionHash: String,

    // Status of blockchain transaction if applicable
    blockchainStatus: {
      type: String,
      enum: ["pending", "confirmed"],
      default: "pending",
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

/**
 * Create compound indexes for optimizing common queries
 */
// Index for finding conversations between users sorted by createdAt
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

// Index for finding messages in a specific chat
messageSchema.index({ chat: 1, createdAt: -1 });

/**
 * Interface for the Message model with custom static methods
 */
export interface MessageModel extends Model<IMessage> {
  // Get messages from a specific chat with pagination
  getMessages(data: {
    chatId: string;
    limit?: number;
  }): Promise<Array<IMessage>>;

  // Add a new message, creating a chat if needed
  addMessage(data: {
    chatId: string | null;
    id: string;
    sender: string;
    receiver: string;
    createdAt: Date;
    content: string;
    contentType: "text" | "image" | "file";
  }): Promise<{
    message: IMessage;
    chat: IChat;
    isNewChat: boolean;
  }>;

  // Update a message's delivery status
  updateDeliveryStatus(
    messageId: string,
    status: "delivered" | "read"
  ): Promise<IMessage>;

  // Get count of unread messages for a user
  getUnreadCount(userId: string): Promise<number>;
}

/**
 * Static method to retrieve messages from a chat with pagination
 */
messageSchema.statics.getMessages = async function ({
  chatId,
  limit = 50,
  before,
}: {
  chatId: string;
  limit?: number;
  before?: Date;
}) {
  await dbConnect();
  // Build query with optional "before" date for pagination

  //  use the query that match the index

  const query: any = {
    chat: chatId,
  };

  if (before) {
    query.createdAt = { $lt: before };
  }

  // Fetch messages with populated sender and receiver details
  const messages = await this.find(query)
    .sort({ createdAt: -1 }) // Newest first
    .limit(Number(limit)) // Limit for pagination
    .populate("sender", "username avatar status walletAddress") // Include sender details
    .populate("receiver", "username avatar status walletAddress") // Include receiver details
    .lean(); // Return plain objects

  if (!messages) {
    throw new Error("No messages found");
  }
  // Get total count for pagination info
  const totalCount = await Message.countDocuments({ chatId });

  return {
    messages,
    hasMore: messages.length === Number(limit), // Indicates if more messages exist
    totalCount, // Total messages in this chat
  };
};

/**
 * Static method to add a new message
 * Handles creating chats if needed and syncing with Firebase
 */
messageSchema.statics.addMessage = async function ({
  chatId = null,
  sender,
  receiver,
  id,
  content,
  createdAt,
  contentType,
}: {
  chatId?: string | null;
  sender: string;
  receiver: string;
  id: string;
  createdAt: Date;
  content: string;
  contentType: "text" | "image" | "file";
}) {
  // Start a transaction for atomicity
  const session = await mongoose.startSession();
  session.startTransaction();

  // Convert user IDs to MongoDB ObjectIDs
  const participantIds = [sender, receiver].map(
    (p) => new mongoose.Types.ObjectId(p)
  );

  try {
    let isNewChat = false;

    // Find existing chat or create new one
    let chat = await Chat.findOne({
      type: "private",
      participants: { $all: participantIds },
    });

    if (!chat) {
      // Create new chat if none exists
      chat = await Chat.create({
        type: "private",
        participants: participantIds,
      });
      isNewChat = true;
    }

    if (isNewChat) {
      // Update both users' chat lists if this is a new chat
      await User.updateMany(
        { _id: { $in: participantIds } },
        {
          $push: { chats: chat._id },
          $set: { updatedAt: new Date() },
        },
        {
          session,
          multi: true,
        }
      );
    }

    // Create the message with specified ID
    const message = await this.create(
      [
        {
          chat: chat._id,
          sender,
          _id: new mongoose.Types.ObjectId(id),
          receiver,
          content,
          contentType,
          deliveryStatus: "sent",
          createdAt,
        },
      ],
      { session }
    );
    // Access the first element of the array before calling populate
    const populatedMessage: IpopulatedMessageContent = await (
      await message[0].populate(
        "sender",
        "username avatar status walletAddress"
      )
    ).populate("receiver", "username avatar status walletAddress");

    // Update chat with reference to this new message
    const chatDoc = await Chat.findByIdAndUpdate(
      chat._id,
      {
        $push: { messages: message[0]._id }, // Add to messages array
        lastMessage: message[0]._id, // Update last message reference
        updatedAt: new Date(), // Update the createdAt
      },
      { new: true, session }
    );

    // Update sender and receiver message lists in parallel
    await Promise.all([
      User.findByIdAndUpdate(
        sender,
        {
          $push: { sentMessages: message[0]._id },
          $set: { updatedAt: new Date() },
        },
        { session }
      ),
      User.findByIdAndUpdate(
        receiver,
        {
          $push: { receivedMessages: message[0]._id },
          $set: { updatedAt: new Date() },
        },
        { session }
      ),
    ]);

    // Sync with Firebase for real-time updates
    if (chat) {
      await FirebaseChat.syncChat(chat);

      await FirebaseChat.syncMessage({
        _id: populatedMessage._id.toString(),
        chat: populatedMessage.chat.toString(),
        sender: populatedMessage.sender,
        receiver: populatedMessage.receiver,
        content: populatedMessage.content,
        contentType: populatedMessage.contentType,
        createdAt: populatedMessage.createdAt!,
        deliveryStatus: populatedMessage.deliveryStatus,
      });
    }

    await session.commitTransaction();
    return {
      message: message[0],
      chat: chatDoc,
      isNewChat: isNewChat,
    };
  } catch (error) {
    // Rollback changes if anything fails
    await session.abortTransaction();
    throw error;
  } finally {
    // Always end the session
    session.endSession();
  }
};

/**
 * Static method to update a message's delivery status
 * Also updates corresponding Firebase data
 */
messageSchema.statics.updateDeliveryStatus = async function (
  messageId: string,
  status: "delivered" | "read"
) {
  const newId = new mongoose.Types.ObjectId(messageId);
  const message = await this.findById(newId);
  if (!message) throw new Error("Message not found");

  // Build update data based on new status
  const updateData: any = {
    deliveryStatus: status,
  };

  // Add createdAt for delivered or read status
  if (status === "delivered") {
    updateData.deliveredAt = new Date();
  } else if (status === "read") {
    updateData.readAt = new Date();
  }

  // Update message status in database
  const updatedMessage = await this.findByIdAndUpdate(newId, updateData, {
    new: true,
  })
    .populate("sender", "username avatar status walletAddress")
    .populate("receiver", "username avatar status walletAddress")
    .lean();

  if (!updatedMessage) throw new Error("Message not found");

  // Convert to the expected IpopulatedMessageContent type
  const mess: IpopulatedMessageContent = {
    ...updatedMessage,
    _id: updatedMessage._id.toString(),
    chat: updatedMessage.chat,
    sender: updatedMessage.sender as unknown as {
      _id: string;
      username: string;
      walletAddress: string;
      avatar?: string;
      status?: string;
    },
    receiver: updatedMessage.receiver as unknown as {
      _id: string;
      username: string;
      walletAddress: string;
      avatar?: string;
      status?: string;
    },
    contentType: updatedMessage.contentType as "text" | "image" | "file",
    createdAt: updatedMessage.createdAt!,
  };

  // Sync updated status to Firebase for real-time updates
  await FirebaseChat.syncMessage({
    _id: mess._id.toString(),
    chat: mess.chat.toString(),
    sender: mess.sender,
    receiver: mess.receiver,
    content: mess.content,
    contentType: mess.contentType,
    createdAt: mess.createdAt!,
    deliveryStatus: mess.deliveryStatus,
  });

  return mess;
};

/**
 * Static method to get count of unread messages for a user
 */
messageSchema.statics.getUnreadCount = async function (userId: string) {
  const newId = new mongoose.Types.ObjectId(userId);

  // Count messages where user is receiver and status isn't "read"
  const resp = await this.countDocuments({
    receiver: newId,
    deliveryStatus: { $ne: "read" },
  });
  return resp;
};

/**
 * Static method to get messages between two specific users
 * Used for direct messaging histories
 */
messageSchema.statics.getMessagesBetweenUsers = async function ({
  userId1,
  userId2,
  limit = 50,
  before = new Date(),
}) {
  // First find the chat between these users
  const chat = await (Chat as ChatModel).findOne({
    type: "private",
    "participants.userId": {
      $all: [userId1, userId2],
    },
  });

  // Return empty array if no chat exists
  if (!chat) {
    return [];
  }

  // Get messages from this chat with pagination
  return this.find({
    chat: chat._id,
    createdAt: { $lt: before },
  })
    .sort({ createdAt: -1 }) // Newest first
    .limit(limit) // Limit for pagination
    .lean(); // Return plain objects
};

/**
 * Create and export the Message model with its custom methods
 * Uses existing model if already defined, otherwise creates a new one
 */
export const Message = ((mongoose.models.Message as Model<IMessage> &
  MessageModel) ||
  mongoose.model<IMessage>("Message", messageSchema)) as Model<IMessage> &
  MessageModel;
