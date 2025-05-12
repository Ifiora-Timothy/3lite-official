import VerticalLayout from "./VerticalLayout";
import clsx from "clsx";
import ChatList from "./ChatList";
import NewGroupChat from "./NewGroupChat";
import { Suspense } from "react";
import { MessageSquare } from "lucide-react";

type Props = { className?: string };

export default function SidebarWindow({ className }: Props) {
  return (
    <VerticalLayout
      header={<NewGroupChat />}
      main={
        <div className="md:w-80 h-full">
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="mb-4 p-4 rounded-full bg-primary-color/10">
                  <MessageSquare className="text-primary-color" size={32} />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  No conversations found
                </h3>
                <p className="text-sm opacity-70">
                  Start a new chat or adjust your search filters
                </p>
              </div>
            }
          >
            <ChatList />
          </Suspense>
        </div>
      }
      className={clsx("border-r border-white/10", {
        " ": !className,
        [className || ""]: className,
      })}
    ></VerticalLayout>
  );
}
