"use client";

import { createContext, PropsWithChildren, useState } from "react";

import { TactiveUser } from "../../../types";

export const ChatContext = createContext<{
  activeUser: TactiveUser | null;
  setActiveUser: (user: TactiveUser | null) => void;
}>(
  {} as {
    activeUser: TactiveUser | null;
    setActiveUser: (user: TactiveUser | null) => void;
  }
);

export const ChatProvider = ({ children }: PropsWithChildren) => {
  const [activeUser, setActiveUser] = useState<TactiveUser | null>(null);

  return (
    <ChatContext.Provider
      value={{
        activeUser,
        setActiveUser,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
