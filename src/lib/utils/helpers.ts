import { Chat } from "@/types";
import { UserDetails } from "../../types";
import { RefObject } from "react";

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
  currChats: Chat[],
  searchQuery: string,
  searchResults: Chat[],
  user: UserDetails | null
): Chat[] {
  const groupChats = currChats.filter(
    (chat) => chat.type === "group"
  );
  const personalChats = currChats.filter(
    (chat) => chat.type === "private"
  );

  let renderedGroupChats: Chat[], renderedPersonalChats: Chat[];
  if (searchQuery.length <= 2) {
    // render the normal chats dont search anythong until the quesry is above 2
   
    return currChats;
  } else {
    // we ncan now use the search esluts and not the original chat lists
    renderedPersonalChats = searchResults.map((personalChat) => {
      // if  we already have the user in our chats, we don't want to return themso we can access the last message
      const existingChat = personalChats.find((chat) =>
        chat._id === personalChat._id
      );
      if(existingChat) {
        return{
          ...existingChat,
          lastMessage: existingChat.lastMessage ?? "no chat yet",
          pinned: user?.pinnedChats?.some((chatId) => chatId === existingChat._id) ?? false,
        }
      }
      // if we don't have the user in our chats,we can return the user as a new chat
      return personalChat;
    });
    renderedGroupChats = groupChats.filter((groupChat) => {
      return groupChat.username.includes(searchQuery);
    });

    return [...renderedGroupChats, ...renderedPersonalChats];
  }
}

// Image processing function to resize and compress images
export function processImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // Create canvas for resizing
        const canvas = document.createElement("canvas");
        // Set max dimensions to 600x600
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;

        let width = img.width;
        let height = img.height;

        // Resize image if it exceeds max dimensions
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with quality adjustment
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to create blob"));
              return;
            }
            // Create a new file from the blob
            const resizedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          },
          "image/jpeg",
          0.85
        ); // Adjust quality (0.85 gives good balance)
      };
      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
}

export async function handleOutsideClick(
  e: React.MouseEvent,
  contentRef: RefObject<HTMLDivElement | null>,
  callback: () => any
) {
  if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
    callback();
  }
}
