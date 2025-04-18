import ChatTop from "@/app/components/ChatTop";
import ChatWindow from "@/app/components/ChatWindow";
import DetailsSidebar from "@/app/components/DetailsSidebar";
import VerticalLayout from "@/app/components/VerticalLayout";
import clsx from "clsx";
import SidebarWindow from "../../components/SidebarWindow";

export default function page() {
  return (
    <div className="contents">
      <SidebarWindow className="col-span-4 hidden md:grid md:col-span-5 lg:col-span-4 md:col-start-1 col-start-1 " />
      <VerticalLayout
        header={<ChatTop />}
        main={<ChatWindow />}
        className={clsx(
          "col-[span_13_/_span_13]  sm:col-[span_14_/_span_14] md:col-span-10 md:col-start-6  lg:col-span-7 lg:col-start-5",
          {}
        )}
      ></VerticalLayout>
      <DetailsSidebar />
    </div>
  );
}
