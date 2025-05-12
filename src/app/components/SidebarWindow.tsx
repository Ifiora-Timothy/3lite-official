
import VerticalLayout from "./VerticalLayout";
import clsx from "clsx";
import ChatList from "./ChatList";
import NewGroupChat from "./NewGroupChat";

type Props = { className?: string };

export default function SidebarWindow({ className }: Props) {

  return (
    <VerticalLayout
      header={<NewGroupChat />}
      main={
        <div className="md:w-80 h-full">
          <ChatList />
        </div>
      }
      className={clsx("border-r border-white/10", {
        " ": !className,
        [className || ""]: className,
      })}
    ></VerticalLayout>
  );
}
