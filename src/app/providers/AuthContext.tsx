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

  useEffect(() => {
    const user = localStorage.getItem("3liteuser");
    if (user) {
      setActiveUser(JSON.parse(user));
    }
  }, []);
  useEffect(() => {
    // Function to set the correct viewport height
    const setVH = () => {
      // First we get the viewport height and multiply it by 1% to get a value for a vh unit
      let vh = window.innerHeight * 0.01;
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    // Set the height initially
    setVH();

    // Add event listener to reset when window is resized
    window.addEventListener("resize", setVH);

    // Clean up
    return () => window.removeEventListener("resize", setVH);
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
