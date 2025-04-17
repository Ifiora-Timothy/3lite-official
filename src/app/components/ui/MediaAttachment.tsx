import Image from "next/image";
import React from "react";

type Props = {};

const MediaAttachment = (props: Props) => {
  return (
    <div className="self-stretch py-4 inline-flex justify-between items-center">
      <div className="flex justify-start items-center gap-3">
        <Image
          src="/icon/attachment.png"
          alt="Logo"
          width={48}
          quality={100}
          priority
          height={48}
          className=" size-12 rounded-lg"
        />
        <div className="inline-flex flex-col justify-start items-start gap-0.5">
          <div className="justify-start text-primary-chat text-base font-semibold font-['Plus_Jakarta_Sans'] leading-normal">
            Intern-font.zip
          </div>
          <div className="self-stretch justify-start text-primary-foreground text-sm font-normal font-['Plus_Jakarta_Sans'] leading-tight">
            12 MB
          </div>
        </div>
      </div>
      <div className="px-4 py-1.5 rounded-[100px] outline outline-1 outline-offset-[-1px] outline-blue-600 flex justify-center items-center gap-2.5">
        <div className="justify-start text-blue-600 text-xs font-medium font-['Plus_Jakarta_Sans'] leading-tight">
          Download
        </div>
      </div>
    </div>
  );
};

export default MediaAttachment;
