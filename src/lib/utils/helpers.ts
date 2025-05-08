import { Chat } from "@/types";
import { UserDetails } from "../../../types";
import { IPopulatedChat } from "../db/models/chat";

export const validateUserInput = (input: string[]) => {
  let valid = true;
  input.forEach((value) => {
    if (value.includes("$") || value.includes("{") || value.includes("}")) {
      valid = false;
    }
  });
  return valid;
};
export function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escapes special regex characters
}

export function getPersonalandGroupChats(
  currChats: IPopulatedChat[],
  searchQuery: string,
  searchResults: UserDetails[],
  user: UserDetails | null
): [
  any,
  Chat[]
] {


  const groupChats = currChats.filter(
    (chat) => chat.type === "group" && chat.participants.length > 2
  );
  const personalChats = currChats.filter(
    (chat) => chat.type === "private" && chat.participants.length === 2
  );

  let renderedGroupChats,
    renderedPersonalChats: Chat[];
  if (searchQuery.length <= 2) {
    // render the normal chats dont search anythong until the quesry is above 2
    renderedGroupChats = groupChats;
    renderedPersonalChats = personalChats.map((personalChat) => {
      const otherParticipant = personalChat.participants.find(
        (participant) => participant._id !== user?._id
      )!;

      return {
        _id: otherParticipant._id,
        username: otherParticipant.username,
        avatar: otherParticipant.avatar || "", // Provide default empty string if avatar is undefined
        lastMessage: personalChat.lastMessage?.content ?? "no chat yet",
        walletAddress: otherParticipant.walletAddress,
        type: "private",
        updatedAt: personalChat.updatedAt.toISOString(),
        status: otherParticipant.status,
        unreadCount: personalChat.unreadCount,
        pinned: user?.pinnedChats?.some(
          (chatId) => chatId === personalChat._id
        ) ?? false,

        
      };
    });
    return [renderedGroupChats, renderedPersonalChats];
  } else {
    // we ncan now use the search esluts and not the original chat lists
    renderedPersonalChats = searchResults.map((user) => {
      // if  we already have the user in our chats, we don't want to return themso we can access the last message
      const existingChat = personalChats.find((chat) =>
        chat.participants.some((participant) => participant._id === user._id)
      );

      if (existingChat) {
        return {
          _id: user._id,
          username: user.username,
          avatar: user.avatar,
          lastMessage: existingChat.lastMessage?.content ?? "no chat yet",
          walletAddress: user.walletAddress,
          type: "private",
          updatedAt: existingChat.updatedAt.toISOString(),
          status: user.status,
          unreadCount: existingChat.unreadCount,
          pinned: user.pinnedChats.includes(existingChat._id),
          
        };
      }
      // if we don't have the user in our chats,we can return the user as a new chat
      return {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        lastMessage: user.lastMessage || "no chat yet",
        walletAddress: user.walletAddress,
        type: "private",
        updatedAt: new Date().toISOString(),
        status: user.status,
        unreadCount: 0,
        pinned: user.pinnedChats?.some((chatId) => chatId === user._id),
      };
    });
    return [groupChats, renderedPersonalChats];
  }
}
