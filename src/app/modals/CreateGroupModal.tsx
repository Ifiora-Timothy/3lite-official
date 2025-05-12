"use client";
import { useState,  useRef } from "react";
import { X, Camera, Search, Check } from "lucide-react";
import {
  getPersonalandGroupChats,
  handleOutsideClick,
  processImage,
} from "@/lib/utils/helpers";
import { toast } from "sonner";
import Image from "next/image";
import { useChatContext } from "../hooks/useChatContext";
import useAuth from "../hooks/useAuth";
import { useDebouncedCallback } from "use-debounce";
import { createGroupChat, getUsersFromRegex } from "@/actions/dbFunctions";
import { Chat } from "@/types";
import { uploadImage } from "@/actions/serverFunctions";


export default function CreateGroupModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Chat[]>([]);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  // Move all useState declarations to the top
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Chat[]>([]);

  const contentRef = useRef<HTMLDivElement>(null);

  const { currChats } = useChatContext();
  const { activeUser } = useAuth();

  let renderedPersonalChats = getPersonalandGroupChats(
    currChats,
    searchQuery,
    searchResults,
    activeUser
  );

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const MAX_FILE_SIZE = 1024 * 1024; // 1MB

    setIsProcessingImage(true);

    try {
      if (file.size > MAX_FILE_SIZE) {
        // Automatically resize the image instead of just showing a toast
        toast.info("Resizing image", {
          description: "Image is being resized to meet size requirements.",
          duration: 2000,
        });

        const resizedFile = await processImage(file);

        // If the image is still too large after processing
        if (resizedFile.size > MAX_FILE_SIZE) {
          toast.error("Image too large", {
            description: "Please select an image under 1MB",
            duration: 3000,
          });

          setIsProcessingImage(false);
          return;
        }

        setProfileImage(resizedFile);

        // Generate preview for resized image
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setImagePreview(reader.result);
          }
        };
        reader.readAsDataURL(resizedFile);
      } else {
        // Image is under size limit, proceed normally
        setProfileImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setImagePreview(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Image processing failed", {
        description: "Please try another image.",
        duration: 3000,
      });
    } finally {
      setIsProcessingImage(false);
    }
  };

  const toggleUserSelection = (user: Chat) => {
    if (selectedUsers.some((u) => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const debounced = useDebouncedCallback(async (userRegex: string) => {
    try {
      const users = await getUsersFromRegex(userRegex);

      if (!activeUser?._id) {
        setSearchResults([]);
        return;
      }

      const parsedUsers = JSON.parse(users).filter(
        (thisUser: { _id: { toString: () => string } }) =>
          thisUser._id.toString() !== activeUser._id
      );

      setSearchResults(parsedUsers);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  }, 300);

  const handleType = (userRegex: string) => {
    setSearchQuery(userRegex);
    if (userRegex.length < 3) {
      // setSearchResults([]);
      return;
    }
    debounced(userRegex);
  };

  const isCreateEnabled = groupName.trim() !== "" && selectedUsers.length >= 2;

  if (!isOpen) return null;

  return (
    <div
      onClick={(event) =>
        handleOutsideClick(event, contentRef, () => setIsOpen(false))
      }
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    >
      <div
        ref={contentRef}
        className="bg-gray-900 rounded-lg w-full max-w-md p-4 text-white transition-all duration-300 ease-in-out"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create Group</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-gray-800 transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <label htmlFor="avatar-upload" className="cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden transition-all duration-200">
                  {/* Preview uploaded image if available */}
                  {imagePreview ? (
                    <div className="relative">
                      <Image
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-full h-full rounded-full object-cover border-2 border-indigo-500 transition-all duration-200"
                        width={96}
                        height={96}
                      />
                    </div>
                  ) : (
                    <div
                      id="avatar-preview"
                      className="w-full h-full flex items-center justify-center"
                    >
                      <Camera size={24} />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 transition-all duration-200">
                  <Camera size={16} />
                </div>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={isProcessingImage}
                />
              </label>
            </div>
            <input
              type="text"
              placeholder="Group Name"
              className="bg-gray-800 rounded-md p-2 flex-grow transition-all duration-200"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm text-gray-400 mb-2">
            Add Participants (at least 2)
          </h3>
          <div className="relative mb-3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="bg-gray-800 rounded-md pl-10 p-2 w-full transition-all duration-200"
              value={searchQuery}
              onChange={(e) => handleType(e.target.value)}
            />
          </div>

          {/* Selected users section with transition */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              selectedUsers.length > 0 ? "max-h-40" : "max-h-0"
            }`}
          >
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedUsers.map((user) => (
                <div
                  key={`selected-${user._id}`}
                  className="bg-blue-600 rounded-full px-3 py-1 flex items-center gap-1 transition-all duration-200"
                >
                  <span className="text-sm">{user.username}</span>
                  <button
                    onClick={() => toggleUserSelection(user)}
                    className="text-xs transition-colors duration-200"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Users list with smooth height transitions */}
          <div className="max-h-64 overflow-y-auto transition-all duration-300 ease-in-out">
            {renderedPersonalChats.filter(chat=>chat.type=="private").map((user) => (
              <div
                key={user._id}
                onClick={() => toggleUserSelection(user)}
                className="flex items-center p-2 hover:bg-gray-800 rounded-md cursor-pointer transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-gray-700 mr-3 flex-shrink-0 overflow-hidden transition-all duration-200">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-10 h-10 rounded-full transition-transform duration-200 hover:scale-105"
                  />
                </div>
                <div className="flex-grow">
                  <div className="font-medium">{user.username}</div>
                  <div className="text-sm text-gray-400">
                    {user.lastMessage}
                  </div>
                </div>
                <div className="ml-2">
                  {selectedUsers.some((u) => u._id === user._id) ? (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center transition-all duration-200">
                      <Check size={14} />
                    </div>
                  ) : (
                    <div className="w-6 h-6 border border-gray-600 rounded-full transition-all duration-200"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            className={`px-4 py-2 rounded-md transition-all duration-300 ${
              isCreateEnabled
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
            disabled={!isCreateEnabled}
            onClick={async () => {
              if (!activeUser) return;
              // if group name is more than 20 characters show a toast error and return
              if (groupName.length > 20) {
                toast.error("Group name too long", {
                  description: "Please keep it under 20 characters.",
                  duration: 3000,
                });
                return;
              }
              const formData = new FormData();
              if (profileImage) {
                formData.append("profile", profileImage);
              }
              const imageUrl =profileImage?JSON.parse(await uploadImage(formData)).url:"/users.png";
              createGroupChat({
                groupDetails: {
                  groupName: groupName,
                  groupAvatar: imageUrl,
                  admins: [activeUser._id],
                },
                participants: [
                  ...selectedUsers.map((user) => user._id),
                  activeUser?._id,
                ],
              })
                .then(() => {
                 
                  toast.success("Group created successfully", {
                    description: `Group ${groupName} created with ${selectedUsers.length} members.`,
                    duration: 3000,
                  });
                  setIsOpen(false);
                  // reset parameters
                  setGroupName("");
                  setSelectedUsers([]);
                  setProfileImage(null);
                  setImagePreview(null);
                })
                .catch((err) => {
                  console.error(err);
                  toast.error("Failed to create group", {
                    description: "Please try again later.",
                    duration: 3000,
                  });
                });
            }}
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
}
