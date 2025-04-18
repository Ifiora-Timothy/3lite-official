import React, { PropsWithChildren } from "react";
import VerticalLayout from "../components/VerticalLayout";
import Link from "next/link";
import Image from "next/image";
import SidebarCollapsed from "../components/SidebarCollapsed";

import { ChatProvider } from "../providers/ChatContext";

function SidebarMini() {
  return (
    <VerticalLayout
      header={
        <Link
          href="/"
          className="w-full h-full bg-background flex justify-center items-center"
        >
          <Image
            src="/icon/avatar2.png"
            alt="Logo"
            width={250}
            quality={100}
            priority
            height={250}
            className=" size-8 rounded-full"
          />
        </Link>
      }
      main={<SidebarCollapsed />}
      className="w-full  "
    ></VerticalLayout>
  );
}

export default function Chatlayout({ children }: PropsWithChildren) {
  return (
    <ChatProvider>
      <div
        style={{
          gridTemplateColumns: "repeat(16, minmax(0, 1fr))",
        }}
        className="grid     h-full  w-screen grid-cols-16 "
      >
        <div className="col-span-3 sm:col-span-2 md:col-span-1 border-r">
          <SidebarMini />
        </div>
        <div className="grid w-full grid-cols-subgrid col-[span_13_/_span_13]  sm:col-[span_14_/_span_14] md:col-[span_15_/_span_15] md:col-start-2">
          {children}
        </div>
      </div>
    </ChatProvider>
  );
}
