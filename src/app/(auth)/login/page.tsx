"use client";

import Link from "next/link";
import WalletConnectionHandler from "@/app/components/WalletButton";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuth from "@/app/hooks/useAuth";

export default function LoginPage() {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const { activeUser, checkUserExists, isLoading } = useAuth();

  useEffect(() => {
    const handleAuthentication = async () => {
      // If already logged in, redirect to chat
      if (activeUser) {
        router.push("/chat");
        return;
      }

      // If wallet is connected, check if user exists
      if (connected && publicKey && !isLoading) {
        const userExists = await checkUserExists();
        
        if (userExists) {
          // User exists, redirect to chat
          router.push("/chat");
        }
        // If user doesn't exist, ProfileSetupModal will be shown by WalletConnectionHandler
      }
    };

    handleAuthentication();
  }, [connected, publicKey, activeUser, isLoading]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212]">
      <div className="sm:flex w-96 font-Syne px-12 py-6 rounded-2xl border border-neutral-600 flex-col justify-start items-center gap-3">
        <div className="Txt mb-3 flex-col justify-start items-center gap-2 flex">
          <div className="font-suse text-white text-3xl font-semibold">
            Continue to 3Lite
          </div>
        </div>

        <div className="w-full flex-col justify-center items-center gap-3 flex">
          <WalletConnectionHandler />
          <p className="text-white mt-2 text-center">Connect with Solana</p>
        </div>
        
        <div className="w-full flex justify-center mt-4">
          <div className="w-fit">
            <span className="text-neutral-400 mr-[1px] text-sm font-normal font-['Montserrat']">
              Don't have an account yet?
            </span>
            <Link
              href="/signup"
              className="text-pink-600 text-sm font-normal font-['Montserrat'] ml-1"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}