import Navbar from "../../components/Navbar";
import React from "react";

import GrainyBackground from "../../components/GrainyBackground";
import ProfileDetails from "../../components/ProfileDetails";
import VerticalLayout from "@/app/components/VerticalLayout";
import Link from "next/link";
import { ChevronLeft, Search, User } from "lucide-react";

export default function ProfilePage() {
  return (
    <main className="col-span-full   h-full  ">
      <VerticalLayout
        header={<ProfileHeader />}
        main={<ProfileDetails />}
        className="w-full "
      ></VerticalLayout>
    </main>
  );
}

function ProfileHeader() {
  return (
    <header className="w-full  border-r  px-9 h-full self-center  place-content-center justify-between items-center">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left side with back button and title */}
        <div className="flex items-center space-x-3">
          <h1 className="font-semibold text-gray-800 text-xl">3Lite Profile</h1>
        </div>

        {/* Right side with accent */}
        <div className="h-6 w-6 bg-blue-500 rounded-full"></div>
      </div>
    </header>
  );
}
