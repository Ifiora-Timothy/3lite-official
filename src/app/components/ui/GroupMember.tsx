import React from "react";
import IconWrapper from "./IconWrapper";
import CustomIcon from "./CustomIcon";

type Props = {};

function GroupMember({}: Props) {
  return (
    <div className="self-stretch  pt-2 pb-3 inline-flex justify-between items-center">
      <div className="flex justify-start items-center gap-3">
        <div className="w-12 h-12 relative bg-violet-200 rounded-[100px]">
          <div className="left-[11px] top-[14px] absolute justify-start text-indigo-500 text-base font-bold font-['Plus_Jakarta_Sans']">
            WO
          </div>
          <div className="w-2.5 h-2.5 left-[36px] top-[4px] absolute bg-green-500 rounded-full border-[1.50px] border-white" />
        </div>
        <div className="inline-flex flex-col justify-start items-start gap-0.5">
          <div className="justify-start text-primary-chat text-base font-semibold font-['Plus_Jakarta_Sans'] leading-normal">
            Wisdom Ozal
          </div>
          <div className="self-stretch justify-start text-primary-foreground text-sm font-normal font-['Plus_Jakarta_Sans'] leading-tight">
            Online
          </div>
        </div>
      </div>
      <div className="h-12 flex justify-center items-center gap-3">
        <IconWrapper>
          <CustomIcon
            name="phone"
            className="fill-primary-1"
            width={16}
            height={16}
          />
        </IconWrapper>
        <IconWrapper>
          <CustomIcon
            name="chat"
            className="fill-primary-1"
            width={20}
            height={20}
          />
        </IconWrapper>
      </div>
    </div>
  );
}

export default GroupMember;
