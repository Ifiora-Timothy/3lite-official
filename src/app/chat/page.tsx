import ChatTop from "@/app/components/ChatTop";
import ChatWindow from "@/app/components/ChatWindow";
import DetailsSidebar from "@/app/components/DetailsSidebar";
import Sidebar from "@/app/components/Sidebar";
import VerticalLayout from "@/app/components/VerticalLayout";
import { ChatProvider } from "@/app/providers/ChatContext";
import clsx from "clsx";

export default function page() {
  return (
    <ChatProvider>
      <div
        style={{
          gridTemplateColumns: "repeat(16, minmax(0, 1fr))",
        }}
        className="grid     h-full  w-screen grid-cols-16 "
      >
        <div
          className={clsx(
            "col-span-3  sm:col-span-2   grid md:col-span-7 lg:col-span-5  grid-cols-subgrid",
            {}
          )}
        >
          <Sidebar />
        </div>
        <VerticalLayout
          header={<ChatTop />}
          main={<ChatWindow />}
          className={clsx(
            "col-[span_13_/_span_13]  sm:col-[span_14_/_span_14] md:col-span-9 md:col-start-8  lg:col-span-7 lg:col-start-6",
            {}
          )}
        ></VerticalLayout>
        <DetailsSidebar />
      </div>
    </ChatProvider>
  );
}
