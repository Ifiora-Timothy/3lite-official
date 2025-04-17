import React from "react";
import CustomIcon from "./ui/CustomIcon";

const ChatSearch = ({
  handleType,
}: {
  handleType: (userRegex: string) => void;
}) => {
  return (
    <div className="self-stretch  px-4 w-full py-3 rounded-2xl outline outline-1 outline-offset-[-1px] outline-gray-100 inline-flex justify-between items-center overflow-hidden">
      <input
        type="text"
        autoComplete="off"
        onChange={(e) => handleType(e.target.value)}
        placeholder="Search..."
        className="flex bg-transparent  w-full placeholder:text-[#58617B]  outline-none text-[#58617B] dark:text-[#DAE3EB] text-sm font-normal font-['Plus_Jakarta_Sans']"
      />
      <div className="w-6 h-5 relative cursor-pointer overflow-hidden">
        <CustomIcon name="search" width={20} height={20} stroke="#999999" />
      </div>
    </div>
  );
};

export default ChatSearch;
