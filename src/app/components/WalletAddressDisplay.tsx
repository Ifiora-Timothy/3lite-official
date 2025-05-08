"use client";
import { useState } from "react";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WalletAddressDisplay({
  walletAddress,
  isGroupChat,
  className,
}: {
  walletAddress: string;
  isGroupChat: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  // If it's a group chat, return the existing group chat component
  if (isGroupChat) {
    return (
      <div className="justify-start">
        <span className="text-primary-foreground text-sm font-normal font-['Plus_Jakarta_Sans']">
          27 members,{" "}
        </span>
        <span className="text-blue-600 text-sm font-medium font-['Plus_Jakarta_Sans']">
          9 online
        </span>
      </div>
    );
  }

  // Function to truncate wallet address
  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 5)}...${address.slice(-3)}`;
  };

  // Copy wallet address to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);

    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="flex items-center justify-start">
      <span
        className={cn(
          "text-primary-foreground text-xs font-medium font-['Plus_Jakarta_Sans'] mr-1",
          className
        )}
      >
        {truncateAddress(walletAddress)}
      </span>
      <button
        onClick={copyToClipboard}
        className="pl-[2px] rounded-md hover:bg-gray-700 transition-colors"
        title="Copy wallet address"
      >
        <Copy
          size={16}
          className={copied ? "text-green-500" : "text-gray-400"}
        />
      </button>
      {copied && (
        <span className="text-green-500 text-xs ml-1 font-['Plus_Jakarta_Sans']">
          Copied!
        </span>
      )}
    </div>
  );
}
