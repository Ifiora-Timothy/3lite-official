"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard = ({ children }: RouteGuardProps) => {
  const { activeUser, isLoading, authInitialized } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Wait for auth to initialize before making decisions
    if (!authInitialized) return;
    
    // Don't redirect while loading is in progress
    if (isLoading) return;

    // If user is not authenticated, redirect to login
    if (!activeUser) {
      setIsRedirecting(true);
      router.push("/login");
    }
  }, [activeUser, isLoading, authInitialized, router]);

  // Show loading spinner during authentication check or redirection
  if (isLoading || isRedirecting || !authInitialized || !activeUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-color mb-4"></div>
        <p className="text-white text-sm">{isRedirecting ? "Redirecting to login..." : "Loading your profile..."}</p>
      </div>
    );
  }

  // If authenticated, show protected content
  return <>{children}</>;
};

export default RouteGuard;