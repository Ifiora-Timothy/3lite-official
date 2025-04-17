import { IMessage } from "@/lib/db/models/message";
import { clsx } from "clsx";
import Image from "next/image";
import React from "react";

type Props = {
  pfp: string;
  groupName: string;
  lastMessage: IMessage;
  time?: string;
  unreadCount?: number;
  active?: boolean;
};

function GroupComponent({
  pfp,
  groupName,
  lastMessage,
  unreadCount = 4,
  time = "12:00 PM",
  active = false,
}: Props) {
  return (
    <div
      className={clsx(
        "self-stretch w-full h-20 px-5 pt-3 pb-4 inline-flex justify-start items-center gap-20",
        { "bg-blue-50 dark:bg-[#151515]": active }
      )}
    >
      {" "}
      <div className="flex-1 flex justify-start items-center gap-3">
        <Image
          src={pfp}
          alt="Logo"
          width={250}
          quality={100}
          priority
          height={250}
          className=" size-10 rounded-full"
        />
        <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
          <div className="self-stretch inline-flex justify-between items-start">
            <div className="justify-start text-primary text-base font-semibold font-['Plus_Jakarta_Sans'] leading-normal">
              {groupName}
            </div>
            <div className="justify-start text-primary-foreground text-xs font-normal font-['Plus_Jakarta_Sans'] leading-normal">
              {time}
            </div>
          </div>
          <div className="self-stretch inline-flex justify-between items-start">
            <div className="flex-1 justify-start">
              <span className="text-primary dark:text-[#808080] dark:text-opacity-55 text-sm font-medium font-['Plus_Jakarta_Sans'] leading-tight">
                {lastMessage.sender.toString()}:
              </span>
              <span className="text-primary-foreground text-sm font-normal font-['Plus_Jakarta_Sans'] leading-tight">
                {lastMessage.content}
              </span>
            </div>
            <div className="px-2 py-0.5  rounded-[100px] outline outline-1 outline-offset-[-1px] outline-blue-600 inline-flex flex-col justify-center items-center gap-2.5">
              <div className="justify-start text-blue-600 text-[10px] font-bold font-['Plus_Jakarta_Sans'] leading-none">
                {unreadCount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupComponent;
