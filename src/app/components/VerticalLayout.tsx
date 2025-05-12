import React, { ReactNode } from "react";

interface LayoutProps {
  header: ReactNode;
  main: ReactNode;
  className?: string;
}

const VerticalLayout: React.FC<LayoutProps> = ({ header, main, className }) => {
  return (
    <div
      className={`grid  sm:grid-rows-10 grid-rows-8 h-screen overflow-hidden ${className} `}
    >
      <div className="place-content-center   row-span-1  row-start-1 ">
        {header}
      </div>
      <div className="h-full w-full  row-span-7 sm:row-span-9  row-start-2 ">
        {main}
      </div>
    </div>
  );
};

export default VerticalLayout;
