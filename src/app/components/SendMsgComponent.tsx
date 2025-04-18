"use client";
import { useState } from "react";
import CustomIcon from "./ui/CustomIcon";
import clsx from "clsx";
import { useChatContext } from "../hooks/useChatContext";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const { isLoading, handleSend, inputRef } = useChatContext();

  const disabled = isLoading ?? false;

  return (
    <div className="w-full py-6 px-5 max-w-4xl mx-auto">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (disabled) return;
          await handleSend();
          // clear the input field
          setMessage("");
        }}
        className="relative flex items-center"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          ref={inputRef}
          placeholder={disabled ? "Loading chat..." : "Type a message..."}
          className="w-full py-3 pl-4 pr-32 bg-gray-100 dark:bg-[#151515] rounded-full focus:outline-none"
        />

        <div className="absolute right-0 flex gap-3 items-center h-full px-4">
          <button
            type="button"
            // onClick={handleEmojiClick}
            className={clsx("  ", {
              " text-gray-500 cursor-not-allowed": disabled,
              " text-primary-foreground hover:bg-purple-600": !disabled,
            })}
          >
            <CustomIcon
              key="emoji"
              name="emoji"
              className=""
              width={20}
              height={20}
            />
          </button>

          <button
            type="button"
            // onClick={handleAttachmentClick}
            className=" text-primary-foreground hover:text-gray-700"
          >
            <CustomIcon
              key="attachment"
              name="attachment"
              className=""
              width={20}
              height={20}
            />

            <input
              id="file-upload"
              type="file"
              className="hidden"
              //   onChange={handleFileChange}
            />
          </button>

          <div className="mx-0.5 h-6 w-px bg-primary-foreground"></div>

          <button
            type="submit"
            className={` rounded-full ${
              message.trim() ? "text-blue-500" : "text-gray-400"
            }`}
            disabled={!message.trim()}
          >
            <CustomIcon
              key="send"
              name="send"
              className=""
              width={20}
              height={20}
            />
          </button>
        </div>
      </form>
    </div>
  );
}
