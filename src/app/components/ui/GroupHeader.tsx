import React from "react";
import IconWrapper from "./IconWrapper";
import CustomIcon from "./CustomIcon";

type Props = {
  setIsOpen: (isOpen: boolean) => void;
};

const GroupHeader = ({ setIsOpen }: Props) => {
  return (
    <div className="px-5 h-full flex justify-between items-center">
      <IconWrapper className="cursor-pointer" onClick={() => setIsOpen(false)}>
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

export default GroupHeader;
