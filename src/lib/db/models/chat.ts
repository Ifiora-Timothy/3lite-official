"use server";
import mongoose, { Model } from "mongoose";
import { IMessage, Message, MessageModel } from "./message";
import { Iuser, User, UserModel } from "./user";

/**
 * Interface defining the structure for group chat details
 */
interface group {
  groupName: string; // Name of the group
  groupAvatar: string; // URL to the group's avatar image
  groupDescription: string; // Text description of the group
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
  groupDetails?: group; // Group-specific details (only for group chats)
  contractAddress?: string; // Optional blockchain contract address (for on-chain functionality)

}

/**
 * Interface for a populated chat with expanded references
 * Replaces ObjectIDs with their actual document content
 */
export interface IPopulatedChat
  extends Omit<IchatContent, "lastMessage" | "participants" | "messages"> {
  lastMessage?: IMessage; // Full message object instead of just the ID
  participants: Array<Iuser>; // Full user objects instead of just IDs
  messages: Array<IMessage>; // Full message objects instead of just IDs
  groupDetails?: group; // Group details if applicable
}

/**
 * Interface for the Chat document with Mongoose Document properties
 */
export interface IChat extends Document, IchatContent {}

/**
 * Interface for the Chat model with custom static methods
 */
export interface ChatModel extends Model<IChat> {
  // Get a chat between two specific users
  getChat(data: { userId: string; user2Id: string }): Promise<IChat>;

  // Get all chats for a specific user
  getChats(data: { userId: string }): Promise<Array<IChat>>;

  // Create a new chat between users
  createChat(data: {
    type: "private" | "group"|"ai"|"ai";
    participants: Array<string>;
  }): Promise<IChat>;
}

/**
 * Mongoose schema definition for Chat documents
 */
const chatSchema = new mongoose.Schema(
  {
    // Type of chat - private (2 users) or group (multiple users)
    type: {
      type: String,
      enum: ["private", "group"],
      required: true,
    },

    // Users participating in this chat
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // References User model
        required: true,
      },
    ],

    // Messages in this chat
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message", // References Message model
      },
    ],
    unreadCount: {
      type: Number,
      default: 0, // Default unread count is 0
    },

    // Most recent message (for chat preview and sorting)
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message", // References Message model
    },

    // Optional blockchain contract address for on-chain functionality
    contractAddress: String,

    // Group chat specific details
    groupDetails: {
      groupName: {
        type: String,
        trim: true,
        maxlength: [100, "Group name cannot exceed 100 characters"],
      },
      groupAvatar: String,
      groupDescription: {
        type: String,
        trim: true,
        maxlength: [500, "Group description cannot exceed 500 characters"],
      },
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields

    // Index to optimize sorting by most recent updates
    indexes: [{ updatedAt: -1 }],
  }
);

/**
 * Compound index to ensure uniqueness of private chats between two specific users
 * Prevents duplicate chats between the same two users
 */
chatSchema.index(
  {
    type: 1,
    participants: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      type: "private",
      participants: { $size: 2 }, // Only apply to private chats with exactly 2 participants
    },
  }
);

/**
 * Pre-save middleware to ensure consistent ordering of participant IDs
 * This helps with uniqueness checks and finding existing chats
 */
chatSchema.pre("save", function (next) {
  if (this.type === "private" && this.participants.length === 2) {
    // Sort participant IDs to ensure consistent ordering
    this.participants.sort((a, b) => a.toString().localeCompare(b.toString()));
  }
  next();
});

/**
 * Static method to get all chats for a specific user
 * Returns populated chats with participant details and last message
 */
chatSchema.statics.getChats = async function ({ userId }: { userId: string }) {
  try {
    // Find all chats where the user is a participant
    const chat = await this.find({
      participants: userId,
    })
      .sort({ updatedAt: -1 }) // Sort by most recent first
      .populate("participants") // Include full user objects
      .populate("lastMessage", "content createdAt deliveryStatus") // Include last message details
      .lean(); // Return plain objects instead of Mongoose documents

    return chat;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Static method to create a new chat or return existing one
 * Handles race conditions and duplicate prevention
 */
chatSchema.statics.createChat = async function ({
  type,
  participants,
}: {
  type: "private" | "group"|"ai";
  participants: Array<string>;
}) {
  // Start a transaction for atomicity
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Convert string IDs to MongoDB ObjectIDs
    const participantIds = participants.map(
      (p) => new mongoose.Types.ObjectId(p)
    );

    // For private chats with exactly 2 participants, check for existing chats first
    if (type === "private" && participants.length === 2) {
      // Check for existing chat first to prevent duplicates
      const existingChat = await this.findOne({
        type: "private",
        participants: { $all: participantIds },
      }).session(session);

      if (existingChat) {
        await session.commitTransaction();
        return existingChat; // Return existing chat instead of creating duplicate
      }
    }

    // Create the new chat if no existing chat found
    const chat = await this.create(
      [
        {
          type,
          participants: participantIds,
        },
      ],
      { session }
    );

    // Update all participants' chat arrays to include this new chat
    await User.updateMany(
      { _id: { $in: participantIds } },
      { $addToSet: { chats: chat[0]._id } }, // Add to set prevents duplicates
      { session }
    );

    await session.commitTransaction();
    return chat[0];
  } catch (error) {
    // Rollback changes if anything fails
    await session.abortTransaction();

    // Special handling for duplicate key errors (race condition)
    if ((error as any).code === 11000) {
      // Duplicate key error - try to fetch the existing chat
      const participantIds = participants.map(
        (p) => new mongoose.Types.ObjectId(p)
      );
      return await this.findOne({
        type: "private",
        "participants.userId": { $all: participantIds },
      });
    }
    console.error("Error in createChat:", error);
    throw error;
  } finally {
    // Always end the session
    session.endSession();
  }
};

/**
 * Static method to get a specific chat between two users
 * Returns populated chat with participant details and messages
 */
chatSchema.statics.getChat = async function ({
  userId,
  user2Id,
}: {
  userId: string;
  user2Id: string;
}) {
  // Convert string IDs to MongoDB ObjectIDs
  const parsedUserId = new mongoose.Types.ObjectId(userId);
  const parsedUser2Id = new mongoose.Types.ObjectId(user2Id);
  try {
    // Find the private chat that includes both users
    return await this.findOne({
      type: "private",
      participants: { $all: [parsedUserId, parsedUser2Id] },
    })
      .sort({ updatedAt: -1 })
      .populate("participants", "username avatar status") // Include key user details
      .populate({
        path: "messages",
        options: {
          sort: { createdAt: 1 }, // Sort messages by createdAt ascending
        },
        populate: [
          { path: "sender", select: "username avatar walletAddress status" },
          { path: "receiver", select: "username avatar walletAddress status" },
        ],
      })
      .lean(); // Return plain objects instead of Mongoose documents
  } catch (error) {
    console.error(error);
    return error;
  }
};

/**
 * Instance method to mark all messages in a chat as read for a specific user
 */
chatSchema.methods.markAllAsRead = async function (userId: string) {
  // Find all unread messages in this chat where the user is the receiver
  const messages = await (Message as MessageModel).find({
    chat: this._id,
    "receiver._id": userId,
    deliveryStatus: { $ne: "read" }, // Only find messages not marked as read
  });

  // Create array of update operations
  const updates = messages.map((message) =>
    (Message as MessageModel).updateDeliveryStatus(message._id, "read")
  );

  // Execute all updates in parallel
  await Promise.all(updates);
};

/**
 * Static method to get an existing chat or create a new one between two users
 * Includes user details in the chat participants
 */
chatSchema.statics.getOrCreateChat = async function ({
  userId1,
  userId2,
}: {
  userId1: string;
  userId2: string;
}) {
  // Start a transaction for atomicity
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // First try to find existing chat between these users
    let chat = await this.findOne({
      type: "private",
      "participants.userId": {
        $all: [userId1, userId2],
      },
    }).session(session);

    if (!chat) {
      // If no chat exists, get user details for both participants
      const [user1, user2] = await Promise.all([
        (User as UserModel)
          .findById(userId1)
          .select("username walletAddress avatar")
          .lean(),
        (User as UserModel)
          .findById(userId2)
          .select("username walletAddress avatar")
          .lean(),
      ]);

      if (!user1 || !user2) {
        throw new Error("One or both users not found");
      }

      // Create new chat with user details embedded
      const newChat = await this.create(
        [
          {
            type: "private",
            participants: [
              {
                userId: user1._id,
                username: user1.username,
                walletAddress: user1.walletAddress,
                avatar: user1.avatar,
              },
              {
                userId: user2._id,
                username: user2.username,
                walletAddress: user2.walletAddress,
                avatar: user2.avatar,
              },
            ],
          },
        ],
        { session }
      );

      // Add chat reference to both users' profiles
      await User.updateMany(
        { _id: { $in: [userId1, userId2] } },
        { $push: { chats: newChat[0]._id } },
        { session }
      );

      chat = newChat[0];
    }

    await session.commitTransaction();
    return chat;
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
 * Static method to get chat history for a user
 * Used for pagination and loading older chats
 */
chatSchema.statics.getChatHistory = async function ({
  userId,
  limit = 20,
  before = new Date(),
}) {
  // Find chats where user is a participant that were updated before the specified date
  const chats = await this.find({
    "participants.userId": userId,
    updatedAt: { $lt: before },
  })
    .sort({ updatedAt: -1 }) // Most recent first
    .limit(limit) // Limit results for pagination
    .populate({
      path: "messages",
      options: {
        sort: { createdAt: -1 }, // Most recent messages first
        limit: 1, // Just get the most recent message
      },
    })
    .lean(); // Return plain objects

  return chats;
};

/**
 * Create and export the Chat model with its custom methods
 * Uses existing model if already defined, otherwise creates a new one
 */
export const Chat = ((mongoose.models.Chat as Model<IChat> & ChatModel) ||
  mongoose.model<IChat>("Chat", chatSchema)) as Model<IChat> & ChatModel;
