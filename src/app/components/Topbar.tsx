import React, { PropsWithChildren } from "react";

export default function Topbar({ children }: PropsWithChildren) {
  return (
    <div className="col-span-16 col-start-1 bg-green-200">
      <div className="">{children}</div>
    </div>
  );
}
