"use client";
import React from "react";
import {
  Wallet,
  MessageSquare,
  Users,
  Grid,
  ExternalLink,
  UserCogIcon,
  Bell,
  Settings,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { CldImage } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import WalletAddressDisplay from "./WalletAddressDisplay";

function ProfileDetails() {
  const { activeUser } = useAuth();

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-6">
      {/* Profile Card */}
      <div className="rounded-xl bg-gradient-to-b from-white to-gray-50 border border-blue-200 shadow-md">
        {/* Header/Banner */}
        <div className="h-32 sm:h-48 rounded-t-xl bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100 relative">
          {/* Profile Picture */}
          <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 overflow-hidden rounded-full ring-4 ring-white bg-gradient-to-r from-blue-400 to-blue-600 p-1">
              {activeUser?.avatar && (
                <CldImage
                  src={activeUser?.avatar}
                  fill
                  alt="Profile picture"
                  className="object-cover rounded-full"
                  crop="thumb"
                  gravity="face"
                  quality="auto"
                  format="auto"
                />
              )}
            </div>
          </div>

          {/* Top right actions */}
          <div className="absolute top-3 right-3 flex space-x-2">
            <button className="p-1 sm:p-2 rounded-full bg-white/70 hover:bg-white/90 transition-colors">
              <Bell size={16} className="text-blue-600 sm:hidden" />
              <Bell size={20} className="text-blue-600 hidden sm:block" />
            </button>
            <button className="p-1 sm:p-2 rounded-full bg-white/70 hover:bg-white/90 transition-colors">
              <Settings size={16} className="text-blue-600 sm:hidden" />
              <Settings size={20} className="text-blue-600 hidden sm:block" />
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-4 sm:p-6 pt-14 sm:pt-20">
          {/* Profile Info */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
                {activeUser?.username}.3Lite
              </h1>
              <p className="text-blue-600 text-sm">Bio</p>
            </div>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <span className="hidden sm:inline">Edit Profile</span>
              <span className="sm:hidden">Edit Profile</span>
              <UserCogIcon size={16} className="sm:hidden" />
            </button>
          </div>

          {/* Wallet Connection */}
          <div className="mb-6 sm:mb-8 bg-blue-50 rounded-xl p-3 sm:p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Wallet className="text-blue-600" size={16} />
                <span className="text-gray-700 font-medium text-sm sm:text-base">
                  Soflare Wallet
                </span>
              </div>
              <span className="text-green-600 text-xs sm:text-sm flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 sm:mr-2"></span>
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <code className="text-xs sm:text-sm text-blue-700">
                <WalletAddressDisplay
                  className="text-xs sm:text-sm text-blue-700"
                  walletAddress={activeUser?.walletAddress ?? ""}
                  isGroupChat={false}
                />
              </code>
              <button className="text-blue-600 hover:text-blue-800 transition-colors">
                <ExternalLink size={16} />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-blue-50 rounded-xl p-3 sm:p-4 border border-blue-200">
              <div className="flex items-center justify-between sm:justify-start sm:space-x-2 mb-1 sm:mb-2">
                <div className="flex items-center gap-1">
                  <MessageSquare
                    size={14}
                    className="text-blue-600 sm:hidden"
                  />
                  <MessageSquare
                    size={16}
                    className="text-blue-600 hidden sm:block"
                  />
                  <span className="text-gray-600 text-xs sm:text-sm">
                    Messages
                  </span>
                </div>
                <p className="text-lg sm:text-2xl font-bold text-gray-800 sm:hidden">
                  128
                </p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-800 hidden sm:block">
                128
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-3 sm:p-4 border border-blue-200">
              <div className="flex items-center justify-between sm:justify-start sm:space-x-2 mb-1 sm:mb-2">
                <div className="flex items-center gap-1">
                  <Users size={14} className="text-blue-600 sm:hidden" />
                  <Users size={16} className="text-blue-600 hidden sm:block" />
                  <span className="text-gray-600 text-xs sm:text-sm">
                    Tokens
                  </span>
                </div>
                <p className="text-lg sm:text-2xl font-bold text-gray-800 sm:hidden">
                  4500
                </p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-800 hidden sm:block">
                4500
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-3 sm:p-4 border border-blue-200">
              <div className="flex items-center justify-between sm:justify-start sm:space-x-2 mb-1 sm:mb-2">
                <div className="flex items-center gap-1">
                  <Grid size={14} className="text-blue-600 sm:hidden" />
                  <Grid size={16} className="text-blue-600 hidden sm:block" />
                  <span className="text-gray-600 text-xs sm:text-sm">NFTs</span>
                </div>
                <p className="text-lg sm:text-2xl font-bold text-gray-800 sm:hidden">
                  12
                </p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-800 hidden sm:block">
                12
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDetails;
