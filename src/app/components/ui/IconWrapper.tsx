import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  [key: string]: any;
  onClick?: () => void;
};

export default function IconWrapper({
  onClick,
  children,
  className,
  ...props
}: Props) {
  return (
    <div
      className={`
    rounded-[100px] size-8 outline outline-[1.50px] outline-offset-[-1.50px] outline-slate-200 flex justify-center items-center overflow-hidden
    ${className}`}
      {...props}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
