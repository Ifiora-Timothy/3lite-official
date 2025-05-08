"use client";

import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { UserDetails } from "../../../types";
import { useWallet } from "@solana/wallet-adapter-react";
import { getUserByWalletAddress } from "@/actions/dbFunctions";
import { usePathname, useRouter } from "next/navigation";

type IAuthContext = {
  activeUser: UserDetails | null;
  setUser: (user: UserDetails) => void;
  isLoading: boolean;
  checkUserExists: () => Promise<boolean>;
  authInitialized: boolean;
}
export const AuthContext = createContext<IAuthContext>(
  {} as IAuthContext
);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [activeUser, setActiveUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { publicKey, connected } = useWallet();
  
  const [authInitialized, setAuthInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const setUser = (user: UserDetails) => {
    // Update the in memory state and local storage
    setActiveUser(user);
    localStorage.setItem("3liteuser", JSON.stringify(user));
  };

  // Check if the user exists in the database
  const checkUserExists = async (): Promise<boolean> => {
    if (!publicKey) return false;
    
    try {
      const walletAddress = publicKey.toBase58();
      const userExist = await getUserByWalletAddress(walletAddress);
      
      if (userExist) {
        const userData = JSON.parse(userExist);
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking user:", error);
      return false;
    }
  };

  // Handle initial load and connection changes
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      // First try to get user from localStorage
      const storedUser = localStorage.getItem("3liteuser");
      if (storedUser) {
        setActiveUser(JSON.parse(storedUser));
      }
      
      // If wallet is connected, check if user exists in DB
      if (connected && publicKey) {
        await checkUserExists();
      }
      
      setIsLoading(false);
      setAuthInitialized(true); // Add this line
    };

    initAuth();
  }, [connected, publicKey]);

  // Set correct viewport height for mobile
  useEffect(() => {
    const setVH = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    
    setVH();
    window.addEventListener("resize", setVH);
    
    return () => window.removeEventListener("resize", setVH);
  }, []);

  return (
    <AuthContext.Provider value={{ activeUser, setUser, isLoading, checkUserExists,authInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};