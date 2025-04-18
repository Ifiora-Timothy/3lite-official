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

function ProfileDetails() {
  const { activeUser } = useAuth();

  return (
    <div className="max-w-4xl w-[900px] mx-auto p-6">
      {/* Profile Card */}
      <div className="rounded-xl bg-gradient-to-b from-white to-gray-50 border border-blue-200 shadow-md">
        {/* Header/Banner */}
        <div className="h-48 rounded-t-xl bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100 relative">
          {/* Profile Picture */}
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 overflow-hidden rounded-full ring-4 ring-white bg-gradient-to-r from-blue-400 to-blue-600 p-1">
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
          <div className="absolute top-4 right-4 flex space-x-2">
            <button className="p-2 rounded-full bg-white/70 hover:bg-white/90 transition-colors">
              <Bell size={20} className="text-blue-600" />
            </button>
            <button className="p-2 rounded-full bg-white/70 hover:bg-white/90 transition-colors">
              <Settings size={20} className="text-blue-600" />
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 pt-20">
          {/* Profile Info */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {activeUser?.username}.3Lite
              </h1>
              <p className="text-blue-600 text-sm">Bio</p>
            </div>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm font-medium transition-colors">
              Edit Profile <UserCogIcon className="sm:hidden" />
            </button>
          </div>

          {/* Wallet Connection */}
          <div className="mb-8 bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Wallet className="text-blue-600" size={20} />
                <span className="text-gray-700 font-medium">
                  Soflare Wallet
                </span>
              </div>
              <span className="text-green-600 text-sm flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <code className="text-sm text-blue-700">
                {activeUser?.walletAddress.slice(0, 5) +
                  "..." +
                  activeUser?.walletAddress.slice(-5)}
              </code>
              <button className="text-blue-600 hover:text-blue-800 transition-colors">
                <ExternalLink size={16} />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <MessageSquare size={16} className="text-blue-600" />
                <span className="text-gray-600 text-sm">Messages</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">128</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Users size={16} className="text-blue-600" />
                <span className="text-gray-600 text-sm">Tokens</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">4500</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Grid size={16} className="text-blue-600" />
                <span className="text-gray-600 text-sm">NFTs</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">12</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDetails;
