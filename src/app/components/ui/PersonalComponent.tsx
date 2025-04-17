import { clsx } from "clsx";
import Image from "next/image";
import React from "react";
import { TactiveUser } from "../../../../types";

type Props = {
  lastMessage?: string | { sender: string; message: string };
  time?: string;
  unreadCount?: number;
  active?: boolean;
  user: TactiveUser;
  setActiveUser: (user: TactiveUser) => void;
};
const USER = "Tim";

function PersonalComponent({
  time = "12:45 AM",
  unreadCount = 2,
  lastMessage = "no chat yet",
  active = false,
  user,
  setActiveUser,
}: Props) {
  const handleClick = () => {
    console.log("clicked", user);
    setActiveUser(user);
  };
  return (
    <div
      className={clsx(
        "self-stretch w-full h-20 px-5 pt-3 pb-4 inline-flex justify-start items-center gap-20",
        "transition-all duration-200 ease-in-out",
        "hover:bg-blue-50 hover:bg-opacity-70 active:bg-blue-50 active:bg-opacity-90",
        "cursor-pointer",
        { "bg-blue-50": active }
      )}
      onClick={handleClick}
      role="button"
    >
      <div className="flex-1 flex justify-start items-center gap-3">
        <div className="relative">
          <Image
            src={user.avatar}
            alt="Profile picture"
            width={250}
            quality={100}
            priority
            height={250}
            className="size-10 rounded-full transition-opacity duration-200 hover:opacity-90"
          />
          {active && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
          <div className="self-stretch inline-flex justify-between items-start w-full">
            <div className="justify-start text-primary text-base font-semibold font-['Plus_Jakarta_Sans'] leading-normal">
              {user.username}
            </div>

            <div className="justify-start text-primary-foreground text-xs font-normal font-['Plus_Jakarta_Sans'] leading-normal opacity-80">
              {time}
            </div>
          </div>
          <div className="self-stretch inline-flex justify-between items-start w-full">
            <div className="flex-1 justify-start  max-w-[100px] text-primary-foreground truncate pr-2">
              {typeof lastMessage === "object" &&
              lastMessage.sender === USER ? (
                <span className="text-primary dark:text-[#808080] dark:text-opacity-55 text-sm font-medium font-['Plus_Jakarta_Sans'] leading-tight">
                  You:{" "}
                </span>
              ) : null}

              <span className=" overflow-hidden text-sm font-normal font-['Plus_Jakarta_Sans'] leading-tight opacity-75">
                {typeof lastMessage === "object"
                  ? lastMessage.message
                  : lastMessage}
              </span>
            </div>
            {unreadCount > 0 && (
              <div className="px-2 py-0.5 rounded-[100px] outline outline-1 outline-offset-[-1px] outline-blue-600 inline-flex flex-col justify-center items-center gap-2.5 transition-all duration-200 hover:bg-blue-600 hover:bg-opacity-10 focus:bg-blue-600 focus:bg-opacity-20">
                <div className="justify-start text-blue-600 text-[10px] font-bold font-['Plus_Jakarta_Sans'] leading-none">
                  {unreadCount}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalComponent;
