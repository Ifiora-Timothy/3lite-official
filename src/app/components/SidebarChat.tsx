import { Search } from "lucide-react";
import React from "react";

const SideBarChat = ({
  handleType,
}: {
  handleType: (userRegex: string) => void;
}) => {
  return (
    <div className="relative">
      <input
        type="text"
        onChange={(e) => handleType(e.target.value)}
        placeholder="Search chats"
        className="w-full p-2 pl-10 rounded-full bg-gray-900 ring-purple-900 ring-[1px] focus:outline-none focus:ring-2 focus:ring-purple-700 text-gray-300"
      />
      <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
    </div>
  );
};

export default SideBarChat;
