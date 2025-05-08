import Image from "next/image";
import React from "react";
import CustomIcon from "./ui/CustomIcon";
import GroupMember from "./ui/GroupMember";
import MediaAttachment from "./ui/MediaAttachment";
import { MessageSquareWarning, OctagonMinus } from "lucide-react";

type Props = {
  chatType: "group" | "private";
  chatData: {
    id: string;
    name: string;
    image: string;
    isVerified?: boolean;
    memberCount?: number;
    members?: Array<any>; // Replace with your member type
    media?: Array<any>; // Replace with your media type
  };
};

function ChatDetails({ chatType, chatData }: Props) {
  const isGroup = chatType === "group";

  return (
    <div className="px-5 overflow-y-auto custom-scrollbar mr-0.5 h-full flex flex-col">
      {/* Profile Header */}
      <div className="flex justify-center">
        <div className="w-44 mt-2 inline-flex flex-col justify-center items-center gap-6">
          <Image
            src={chatData.image || "/icon/default-avatar.png"}
            alt={`${chatData.name} profile`}
            width={241}
            quality={100}
            priority
            height={241}
            className="size-[120px] rounded-full"
          />
          <div className="self-stretch inline-flex justify-center items-center gap-1">
            <div className="justify-start text-primary text-xl font-bold font-['Plus_Jakarta_Sans'] leading-normal">
              {chatData.name}
            </div>
            {chatData.isVerified && (
              <CustomIcon name="verified" className="" width={22} height={22} />
            )}
          </div>
        </div>
      </div>

      {/* Members Section (Only for Group) */}
      {isGroup && (
        <div className="w-full">
          <div className="w-full py-4 inline-flex justify-between items-center">
            <div className="flex justify-start items-start gap-2">
              <div className="justify-start text-primary-1 text-base font-bold font-['Plus_Jakarta_Sans']">
                Members
              </div>
              <div className="w-10 px-2.5 py-1 bg-primary-1 rounded-[100px] inline-flex flex-col justify-center items-center gap-2.5">
                <div className="justify-start text-background text-xs font-bold font-['Plus_Jakarta_Sans'] leading-none">
                  {chatData.memberCount || 0}
                </div>
              </div>
            </div>
            <CustomIcon name="down" className="" width={24} height={24} />
          </div>
          <div className="flex flex-col">
            {chatData.members?.slice(0, 2).map((member, index) => (
              <GroupMember key={index} {...member} />
            ))}
          </div>
          <div className="w-full px-5 py-4 inline-flex flex-col justify-start items-start gap-2.5">
            <div className="self-stretch py-3 bg-blue-50 dark:bg-[#151515] rounded-2xl inline-flex justify-center items-center gap-1">
              <CustomIcon name="plus" className="" width={25} height={24} />
              <div className="justify-start text-blue-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-normal">
                Add Members
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Personal Chat Actions (Only for Personal) */}
      {!isGroup && (
        <div className="w-full py-4">
          <div className="flex flex-col gap-2">
            <button className="w-full py-3 bg-blue-50 dark:bg-[#151515] rounded-2xl inline-flex justify-center items-center gap-2">
              <OctagonMinus className="stroke-blue-700" size={18} />
              <div className="text-blue-700 text-sm font-semibold font-['Plus_Jakarta_Sans']">
                Block User
              </div>
            </button>
            <button className="w-full py-3 bg-red-50 dark:bg-[#1F1515] rounded-2xl inline-flex justify-center items-center gap-2">
              <MessageSquareWarning className="stroke-red-600" size={18} />
              <div className="text-red-600 text-sm font-semibold font-['Plus_Jakarta_Sans']">
                Report User
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Media Attachments - for both chat types */}
      <div className="">
        <div className="self-stretch w-full py-4 inline-flex justify-between items-center">
          <div className="flex justify-start items-start gap-2">
            <div className="justify-start text-primary text-base font-bold font-['Plus_Jakarta_Sans'] leading-normal">
              Media Attachment
            </div>
          </div>
          <CustomIcon name="more" className="" width={20} height={20} />
        </div>
        <div className="flex flex-col">
          {chatData.media?.slice(0, 2).map((mediaItem, index) => (
            <MediaAttachment key={index} {...mediaItem} />
          ))}
          {(!chatData.media || chatData.media.length === 0) && (
            <div className="py-4 text-center text-gray-500">
              No media shared yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatDetails;
