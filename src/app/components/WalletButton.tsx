"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import ProfileSetupModal from "./ProfileCompletion";
import useAuth from "../hooks/useAuth";

export default function WalletConnectionHandler() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
 
  const { publicKey, connected, disconnect } = useWallet();
  const { checkUserExists, isLoading } = useAuth();

  const disconnectWallet = async () => {
    await disconnect();
    localStorage.removeItem("3liteuser");
  };

  useEffect(() => {
    const handleWalletConnection = async () => {
      if (!connected || !publicKey || isLoading) return;

      try {
        // Check if user exists in the database
        const userExists = await checkUserExists();

        if (!userExists) {
          // Show profile setup if the user doesn't exist
          setIsProfileModalOpen(true);
        }
      } catch (error) {
        console.error("Error handling wallet connection:", error);
      }
    };

    handleWalletConnection();
  }, [connected, publicKey, isLoading]);

  return (
    <div>
      <ProfileSetupModal
        setIsOpen={setIsProfileModalOpen}
        disconnect={disconnectWallet}
        isOpen={isProfileModalOpen}
      />
      <WalletMultiButton />
    </div>
  );
}