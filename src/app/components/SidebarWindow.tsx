import React from "react";
import VerticalLayout from "./VerticalLayout";
import IconWrapper from "./ui/IconWrapper";
import CustomIcon from "./ui/CustomIcon";
import ChatsSidebar from "./ChatsSidebar";
import clsx from "clsx";

type Props = { className?: string };

export default function SidebarWindow({ className }: Props) {
  return (
    <VerticalLayout
      header={
        <div className="h-full border-r  flex justify-between px-5 items-center ">
          <div className="flex justify-start items-center gap-1.5">
            <div className="justify-start text-primary text-xl font-bold font-plusJakartaSans">
              Messages
            </div>
            <div className="w-10 px-2.5 py-1 rounded-[100px] outline outline-1 outline-offset-[-1px] outline-blue-600 inline-flex flex-col justify-center items-center gap-2.5">
              <div className="justify-start text-blue-600 text-xs font-bold font-['Plus_Jakarta_Sans'] leading-none">
                32
              </div>
            </div>
          </div>
          <IconWrapper className="outline-primary-foreground">
            <CustomIcon
              name="edit"
              className="stroke-primary dark:stroke-primary-foreground fill-none"
              width={18}
              height={18}
            />
          </IconWrapper>
        </div>
      }
      main={<ChatsSidebar />}
      className={clsx("", {
        "col-span-4 hidden md:grid md:col-span-6 md:col-start-2 col-start-2 ":
          !className,
        [className || ""]: className,
      })}
    ></VerticalLayout>
  );
}
