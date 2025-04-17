"use client";

import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { UserDetails } from "../../../types";

export const AuthContext = createContext<{
  activeUser: UserDetails | null;
  setUser: (user: UserDetails) => void;
}>(
  {} as {
    activeUser: UserDetails | null;
    setUser: (user: UserDetails) => void;
  }
);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [activeUser, setActiveUser] = useState<UserDetails | null>(null);
  const setUser = (user: UserDetails) => {
    //update the in memory state and local storage
    setActiveUser(user);
    localStorage.setItem("3liteuser", JSON.stringify(user));
  };
  console.log(activeUser);

  useEffect(() => {
    const user = localStorage.getItem("3liteuser");
    if (user) {
      setActiveUser(JSON.parse(user));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        activeUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
