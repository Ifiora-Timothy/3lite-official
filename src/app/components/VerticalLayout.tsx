import React, { ReactNode } from "react";

interface LayoutProps {
  header: ReactNode;
  main: ReactNode;
  className?: string;
}

const VerticalLayout: React.FC<LayoutProps> = ({ header, main, className }) => {
  return (
    <div
      className={`grid sm:grid-rows-7 grid-rows-8 h-screen overflow-hidden ${className}`}
    >
      <div className="header-container border-b row-span-1 pt-3 row-start-1 ">
        {header}
      </div>
      <div className="main-container h-full row-span-7 sm:row-span-6  row-start-2 ">
        {main}
      </div>
    </div>
  );
};

export default VerticalLayout;
