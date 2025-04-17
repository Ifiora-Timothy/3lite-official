import Message from "./MessageComponent";
import { IMessage } from "../../../types";
import { RefObject } from "react";
import clsx from "clsx";

type chatProps = {
  type: "group" | "private";
  isLoading: boolean;
  optimisticMessages: IMessage[];
  messagesEndRef: RefObject<HTMLDivElement | null>;
};

const ChatsContainer = ({
  type,
  isLoading,
  optimisticMessages,
  messagesEndRef,
}: chatProps) => {
  // Show skeleton loaders while loading messages
  if (isLoading) {
    return (
      <div className="h-full w-full custom-scrollbar px-5 overflow-y-auto">
        <div className="flex flex-col w-full h-full pt-4">
          {/* Generate a variety of message skeletons to mimic a conversation */}
          <MessageSkeleton isSelf={false} isConsecutive={false} />
          <MessageSkeleton isSelf={false} isConsecutive={true} />
          <MessageSkeleton isSelf={true} isConsecutive={false} />
          <MessageSkeleton isSelf={true} isConsecutive={true} />
          <MessageSkeleton isSelf={false} isConsecutive={false} />
          <MessageSkeleton isSelf={true} isConsecutive={false} />
        </div>
      </div>
    );
  }

  const renderMessages = () => {
    return optimisticMessages.map((message, index) => {
      // Check if this message is consecutive (same sender as previous message)
      const isConsecutive =
        index > 0 &&
        optimisticMessages[index - 1].sender._id === message.sender._id;

      // Check if this is the last consecutive message or a single message
      const isLastOrSingleConsecutive =
        ((index === 0 ||
          optimisticMessages[index - 1].sender._id !== message.sender._id) &&
          (index === optimisticMessages.length - 1 ||
            optimisticMessages[index + 1].sender._id !== message.sender._id)) ||
        (index < optimisticMessages.length - 1 &&
          optimisticMessages[index + 1].sender._id !== message.sender._id);

      // Render individual message component
      return (
        <Message
          key={message._id}
          sender={message.sender}
          createdAt={message.createdAt}
          message={message.content}
          isConsecutive={isConsecutive}
          isLastOrSingleConsecutive={isLastOrSingleConsecutive}
          type={type}
        />
      );
    });
  };

  const noMessages =
    optimisticMessages.length === 0 ||
    optimisticMessages.every((message) => message.content === "");

  return (
    <div className="h-full w-full custom-scrollbar px-5 overflow-y-auto">
      <div className="flex flex-col w-full h-full pt-4">
        {noMessages ? <NoMessages /> : renderMessages()}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

/**
 * Message skeleton loader for loading state
 * @returns {JSX.Element} Skeleton UI for a message
 */
const MessageSkeleton = ({
  isSelf = false,
  isConsecutive = false,
  type = "private",
}: {
  isSelf?: boolean;
  type?: "group" | "private";
  isConsecutive?: boolean;
}) => {
  return (
    <div className={clsx("w-full", isConsecutive ? "mt-1" : "mt-3")}>
      {/* Name and time skeleton - only for non-consecutive messages */}
      {!isConsecutive && (
        <div className={clsx(isSelf ? "text-right" : "text-left", "mb-1")}>
          <div className="inline-block ml-2 h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      )}

      {/* Message row with avatar and bubble */}
      <div
        className={clsx(
          "flex items-end",
          isSelf ? "justify-end" : "justify-start"
        )}
      >
        {/* Avatar space for non-self messages */}
        {!isSelf && type === "group" && (
          <div className="mr-2 flex-shrink-0 w-8">
            <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
          </div>
        )}

        {/* Message bubble skeleton */}
        <div
          className={clsx(
            "px-4 py-3 rounded-2xl relative",
            isSelf
              ? "bg-gray-300 dark:bg-gray-600"
              : "bg-gray-200 dark:bg-gray-700",
            "max-w-[75%] animate-pulse"
          )}
        >
          <div className="h-4 w-24 bg-gray-400 dark:bg-gray-500 rounded"></div>
        </div>

        {/* Empty space on right for balance (only for non-self messages) */}
        {!isSelf && <div className="w-2"></div>}
      </div>
    </div>
  );
};

/**
 * NoMessages component shown when there are no messages in the chat
 * @returns {JSX.Element} Empty state UI for the chat
 */
const NoMessages = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center p-4">
      <div className="w-48 h-48 dark:bg-gray-700 bg-blue-50 rounded-full flex items-center justify-center mb-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-70"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      <h2 className="text-2xl font-semibold mb-4">No messages yet</h2>
      <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
        Connect with friends, colleagues, or start new conversations to see your
        messages here.
      </p>
      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
        Start a new conversation
      </button>
    </div>
  );
};

export default ChatsContainer;
