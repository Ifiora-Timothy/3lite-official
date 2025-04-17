import React from "react";
import ChatDetails from "./GroupDetails";
import VerticalLayout from "./VerticalLayout";
import clsx from "clsx";
import IconWrapper from "./ui/IconWrapper";
import CustomIcon from "./ui/CustomIcon";

type Props = { className?: string };

const DetailsSidebar = ({ className }: Props) => {
  return (
    <VerticalLayout
      header={<Header3 />}
      main={
        <ChatDetails
          chatType="group"
          chatData={{
            id: "123",
            name: "EliteLabs",
            image: "/icon/elitelabs.png",
            isVerified: true,
            memberCount: 27,
            members: ["Timothy"], // Your member data
            media: ["zip", "pdf"], // Your media data
          }}
          // chatType="personal"
          // chatData={{
          //   id: "456",
          //   name: "Techdoc",
          //   image: "/icon/elitelabs.png",
          //   media: ["zip"],
          // }}
        />
      }
      className={clsx("", {
        [className || ""]: className,
        "hidden lg:grid lg:col-start-13 lg:col-span-4": !className,
      })}
    ></VerticalLayout>
  );
};
export const Header3 = () => {
  return (
    <div className="px-5 h-full flex justify-between items-center">
      <IconWrapper>
        <CustomIcon
          name="x"
          className="fill-foreground stroke-foreground"
          width={10}
          height={10}
        />
      </IconWrapper>
      <div className="justify-start text-primary text-base font-bold font-plusJakartaSans">
        Group info
      </div>
      <IconWrapper>
        <CustomIcon
          name="info"
          className="fill-red-300 stroke-foreground"
          width={24}
          height={24}
        />
      </IconWrapper>
    </div>
  );
};
export default DetailsSidebar;
