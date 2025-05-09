"use client";
import { getUserByWalletAddress } from "@/actions/dbFunctions";
import useAuth from "../hooks/useAuth";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ProfileSetupModal from "./ProfileCompletion";

export default function WalletConnectionHandler() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { publicKey, connected, disconnect } = useWallet();
  const { setUser } = useAuth();
  const prevConnectedRef = useRef(connected);
  const disconnectWallet = async () => {
    // Disconnect logic here
    await disconnect();
  };

  const keyString = publicKey?.toString();
  useEffect(() => {
    // Track previous connection state

    const storeWalletDetails = async () => {
      // Check if user just connected (was disconnected before, now connected)
      const justConnected = connected && !prevConnectedRef.current;

      // Update ref for next render
      prevConnectedRef.current = connected;

      // If disconnected, clear the navigation flag
      if (!connected) {
        sessionStorage.removeItem("initialNavigation");
        return;
      }

      if (connected && publicKey) {
        try {
          // 1. Basic wallet details
          const walletDetails = {
            walletAddress: publicKey.toBase58(),
            connectionTimestamp: new Date(),
            walletType: publicKey.toString().startsWith("phantom")
              ? "Phantom"
              : "Solflare",
          };
          const userExist = await getUserByWalletAddress(
            walletDetails.walletAddress
          );

          if (userExist) {
            setUser(JSON.parse(userExist));

            // Check if we need to navigate (either just connected or first render)
            const hasInitiallyNavigated =
              sessionStorage.getItem("initialNavigation");

           if (
              (!hasInitiallyNavigated || justConnected) &&
              (pathname === "/")
            ) {
              sessionStorage.setItem("initialNavigation", "true");
              router.push("/chat");
            }
             return;
          } else {
            setIsOpen(true);
          }
        } catch (error) {
          console.error("Error storing wallet details:", error);
        }
      }
    };

    storeWalletDetails();
  }, [keyString, connected, pathname]);

  return (
    <div>
      <ProfileSetupModal
        setIsOpen={setIsOpen}
        disconnect={disconnectWallet}
        isOpen={isOpen}
      />
      <WalletMultiButton />
    </div>
  );
}