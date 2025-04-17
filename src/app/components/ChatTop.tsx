"use client";
import React, { useState } from "react";
import IconWrapper from "./ui/IconWrapper";
import CustomIcon from "./ui/CustomIcon";
import Image from "next/image";
import { useChatContext } from "../hooks/useChatContext";
import WalletAddressDisplay from "./WalletAddressDisplay";
import clsx from "clsx";
import { BadgeInfo } from "lucide-react";
import ReuseableSheet from "./ReuseableSheet";
import DetailsSidebar from "./DetailsSidebar";

const ChatTop = () => {
  const isGroup = false;
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { activeUser, setActiveUser } = useChatContext();
  return (
    <div className="w-full border-r  px-5 h-full flex justify-between items-center">
      <div className="flex justify-start items-center gap-2.5">
        <div className="w-full min-w-12 h-full flex justify-center items-center">
          <Image
            src={activeUser?.avatar || "/icon/avatar2.png"}
            alt="Logo"
            width={250}
            quality={100}
            priority
            height={250}
            className=" size-12 rounded-full"
          />
        </div>
      </div>
      <div className="lg:pl-16   inline-flex flex-col justify-center items-start gap-1">
        <div
          className={clsx("flex w-full   items-center gap-1", {
            "justify-center ": !isGroup,
            "justify-start": isGroup,
          })}
        >
          <div
            className={clsx(
              "justify-center text-primary   text-base font-bold font-['Plus_Jakarta_Sans']",
              {
                "justify-center": !isGroup,
                "justify-start": isGroup,
              }
            )}
          >
            {activeUser?.username}
          </div>
          <div
            className={clsx("w-6 h-6 relative overflow-hidden", {
              hidden: !isGroup,
            })}
          >
            <CustomIcon name="verified" className="" size={22} color="#333" />
          </div>
        </div>
        <WalletAddressDisplay
          isGroupChat={isGroup}
          walletAddress={activeUser?.walletAddress ?? "0x00"}
        />
      </div>{" "}
      <div className="lg:contents gap-4 bg-red-40 flex justify-between items-center">
        <div className="flex justify-start items-center gap-3">
          <IconWrapper className="hidden min-[600px]:flex">
            <CustomIcon
              name="video"
              className="fill-foreground"
              width={14}
              height={10}
            />
          </IconWrapper>
          <IconWrapper className="hidden min-[600px]:flex">
            <CustomIcon
              name="phone"
              className="fill-foreground"
              width={16}
              height={16}
            />
          </IconWrapper>
          <IconWrapper>
            <CustomIcon
              name="more"
              className="fill-foreground"
              width={20}
              height={20}
            />
          </IconWrapper>
        </div>
        <div
          onClick={() => {
            setIsDetailsOpen((prev) => !prev);
          }}
          className="hidden cursor-pointer min-[600px]:flex items-center lg:hidden"
        >
          <BadgeInfo className="stroke-primary-foreground" size={30} />
        </div>
        <ReuseableSheet
          setIsOpen={setIsDetailsOpen}
          side="right"
          width="w-[340px]"
          isOpen={isDetailsOpen}
        >
          <div className="w-full  flex">
            <DetailsSidebar className="w-full" />
          </div>
        </ReuseableSheet>
      </div>
    </div>
  );
};

export default ChatTop;
