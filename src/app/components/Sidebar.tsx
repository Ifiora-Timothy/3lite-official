import React from "react";
import VerticalLayout from "./VerticalLayout";
import Image from "next/image";
import Link from "next/link";
import SidebarCollapsed from "./SidebarCollapsed";
import SidebarWindow from "./SidebarWindow";

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
      className="col-span-3 sm:col-span-2 md:col-span-1 border-r "
    ></VerticalLayout>
  );
}

export default function Sidebar() {
  return (
    <div className="contents ">
      <SidebarMini />
      <SidebarWindow />
    </div>
  );
}

//sidebar collapsed
