"use client";
import { useState } from "react";
import CustomIcon from "./ui/CustomIcon";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReuseableSheet from "./ReuseableSheet";
import SidebarWindow from "./SidebarWindow";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function SidebarCollapsed() {
  const [isMainSidebarOpen, setIsMainSidebarOpen] = useState(false);

  // get the current path
  const pathname = usePathname();
  // check if the current path is the same as the sidebar link
  const isActive = (path: string) => {
    return pathname === path;
  };

  const toggleSidebar = () => {
    setIsMainSidebarOpen(!isMainSidebarOpen);
  };
  return (
    <div className="w-full  mt-0 md:mt-4 inline-flex flex-col justify-start items-start">
      <div
        onClick={toggleSidebar}
        className="self-stretch flex h-16 py-5 md:hidden justify-center items-center cursor-pointer border-y border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Toggle main sidebar"
        role="button"
      >
        <div className="relative flex items-center justify-center">
          {isMainSidebarOpen ? (
            <ChevronLeft width={20} height={20} />
          ) : (
            <ChevronRight width={20} height={20} />
          )}
        </div>
      </div>
      {[
        { name: "list/category", href: "/profile" },
        { name: "list/chat", href: "/chat" },
        { name: "list/calender", href: "#" },
        { name: "list/document", href: "#" },
        { name: "list/edit", href: "#" },
        { name: "list/info", href: "#" },
        { name: "list/settings", href: "#" },
      ].map((icon) => {
        return (
          <Link
            href={`${icon.href}`}
            key={icon.name}
            className="self-stretch h-16 py-5 bg-black/0 inline-flex justify-center items-center gap-2.5 overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <CustomIcon
              name={icon.name}
              className={clsx("", {
                "fill-[#196FF7]": isActive(icon.href),
                "fill-[#ABB9CE]": !isActive(icon.href),
              })}
              width={24}
              height={24}
            />
          </Link>
        );
      })}
      <ReuseableSheet
        setIsOpen={setIsMainSidebarOpen}
        side="left"
        width="w-[300px] sm:w-[340px]"
        isOpen={isMainSidebarOpen}
      >
        <div className="w-full flex">
          <SidebarWindow className="w-full" />
        </div>
      </ReuseableSheet>
    </div>
  );
}
