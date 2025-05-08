"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import ProfileSetupModal from "./ProfileCompletion";
import useAuth from "../hooks/useAuth";

export default function WalletConnectionHandler() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
 
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { checkUserExists, isLoading } = useAuth();

  const disconnectWallet = async () => {
    await disconnect();
    localStorage.removeItem("3liteuser");
  };

  // Custom button handler
  const handleWalletAction = () => {
    if (connected) {
      disconnectWallet();
    } else {
      setVisible(true);
    }
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

  // Display wallet address in shortened form
  const displayAddress = publicKey 
    ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
    : '';

  return (
    <div>
      <ProfileSetupModal
        setIsOpen={setIsProfileModalOpen}
        disconnect={disconnectWallet}
        isOpen={isProfileModalOpen}
      />
      
      {/* Custom wallet button */}
      <button 
        onClick={handleWalletAction}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-full font-medium hover:shadow-lg hover:opacity-90 transition-all"
      >
        {connected ? (
          <span>
            {displayAddress} {/* Show shortened wallet address */}
            <span className="ml-2">▼</span> {/* Dropdown indicator */}
          </span>
        ) : (
          "Connect Wallet"
        )}
      </button>
    </div>
  );
}