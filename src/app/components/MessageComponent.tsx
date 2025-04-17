import React from "react";
import clsx from "clsx";
import CustomIcon from "./ui/CustomIcon";
import {} from "date-fns";
import useAuth from "../hooks/useAuth";
import Image from "next/image";

type MessageProps = {
  sender: {
    _id: string;
    username: string;
    walletAddress: string;
    avatar?: string;
    status?: string;
  };
  createdAt: Date;
  message: string;
  type: "group" | "private";
  isConsecutive?: boolean;
  isLastOrSingleConsecutive?: boolean;
  isLoading?: boolean;
};

const Message = ({
  sender,
  createdAt,
  message,
  type,
  isLastOrSingleConsecutive,
  isConsecutive = false,
  isLoading = false,
}: MessageProps) => {
  const { activeUser: user } = useAuth();
  const isSelf = sender.username === user?.username;
  const formattedTime = new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isLoading) {
    return (
      <div className={clsx("w-full", isConsecutive ? "mt-1" : "mt-3")}>
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-300 animate-pulse"></div>
          <div className="ml-2 h-6 w-32 bg-gray-300 animate-pulse"></div>
        </div>
      </div>
    );
  }
  return (
    <div className={clsx("w-full", isConsecutive ? "mt-1" : "mt-3")}>
      {/* Name and time - only show for first message in a sequence */}
      {!isConsecutive && (
        <div className={clsx(isSelf ? "text-right" : "text-left", "mb-1")}>
          <span
            className={clsx(
              "text-primary dark:text-primary-foreground  text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-tight",
              {
                // space by the left if not self
                "ml-10": !isSelf,
                hidden: type === "private",
              }
            )}
          >
            {isSelf ? "You" : sender.username}
          </span>
          <span className="text-primary-foreground text-xs font-normal font-['Plus_Jakarta_Sans'] leading-tight">
            {type === "group" && " • "}
            {formattedTime}
          </span>
        </div>
      )}

      {/* Message row with avatar and bubble */}
      <div
        className={clsx(
          "flex items-end",
          isSelf ? "justify-end" : "justify-start"
        )}
      >
        {/* Avatar space - always reserve space for non-self messages */}
        {type === "group" && !isSelf && (
          <div className="mr-2 flex-shrink-0 w-8">
            {!isSelf && isLastOrSingleConsecutive && (
              <div className="h-8 rounded-full bg-gray-300  overflow-hidden">
                {sender.avatar ? (
                  <Image
                    src={sender.avatar}
                    alt={sender.username}
                    height={32}
                    width={32}
                    priority
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-semibold">
                    {sender.username?.charAt(0) || "?"}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Message bubble */}
        <div
          className={clsx(
            "px-4 py-3 rounded-2xl inline-flex justify-center items-center",
            isSelf ? "bg-secondary" : "bg-slate-100 dark:bg-[#151515]",
            "relative",
            "max-w-[75%]"
          )}
        >
          <div
            className={clsx(
              "text-sm font-normal font-['Plus_Jakarta_Sans'] leading-tight",
              isSelf ? "text-background" : "text-primary-chat"
            )}
          >
            {message}
          </div>
          {isSelf && isLastOrSingleConsecutive && (
            <div className="absolute -right-[5px] -bottom-0.5">
              <CustomIcon
                className="fill-secondary"
                name="chatbubble"
                width={19}
                height={29}
              />
            </div>
          )}
          {!isSelf && isLastOrSingleConsecutive && (
            <div className="absolute -left-[5px] -bottom-0.5">
              <CustomIcon
                name="chatbubbleleft"
                width={19}
                height={29}
                className="fill-slate-100 dark:fill-[#151515]"
              />
            </div>
          )}
        </div>

        {/* Empty space on right for balance (only for non-self messages) */}
        {!isSelf && <div className="w-2"></div>}
      </div>
    </div>
  );
};

export default Message;
