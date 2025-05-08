"use client";

import React from "react";
import { ArrowRight, MessageSquare, Wallet } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { SolflareWalletName } from "@solana/wallet-adapter-solflare";

const Hero: React.FC = () => {
  const { connect,select } = useWallet();
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="block ">Chat. Transact.</span>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Connect — All in One App.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
              3lite Messenger lets you send messages and crypto in seconds.
              Fast, secure, and built for the next-gen internet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
            <button
                 onClick={async () => {
                  select(SolflareWalletName);
                }}
                
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white font-medium flex items-center justify-center hover:shadow-lg hover:opacity-90 transition-all"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <a
                href="#how-it-works"
                className="px-8 py-3 border-2 border-indigo-600 rounded-full text-indigo-600 font-medium flex items-center justify-center hover:bg-indigo-50 transition-all"
              >
                Learn More
              </a>
            </div>
            <div className="mt-8 flex items-center text-sm text-gray-500">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 border-2 border-white flex items-center justify-center text-white text-xs"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="ml-4">Joined by 10,000+ early adopters</p>
            </div>
          </div>

          <div className="order-1 md:order-2 relative">
            <div className="w-full max-w-md mx-auto">
              <div className="relative z-10">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MessageSquare className="h-6 w-6 text-white/90" />
                        <span className="ml-2 text-white font-medium">
                          3lite
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <Wallet className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start mb-4">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                        A
                      </div>
                      <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 max-w-[80%]">
                        <p className="text-sm">Hey! Can you send me 0.5 ETH?</p>
                      </div>
                    </div>
                    <div className="flex items-start justify-end mb-4">
                      <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-none p-3 max-w-[80%]">
                        <p className="text-sm">Sure, sending it now! 👍</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center ml-3 flex-shrink-0">
                        B
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-xl p-3 mb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-500">SENDING</p>
                          <p className="font-medium">0.5 ETH</p>
                        </div>
                        <div className="bg-green-100 text-green-700 text-xs py-1 px-2 rounded-full">
                          Confirmed
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center border-t pt-3">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-100 rounded-full py-2 px-4 text-sm focus:outline-none"
                      />
                      <button className="ml-2 bg-indigo-600 text-white p-2 rounded-full">
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400/30 rounded-full filter blur-3xl"></div>
              <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-indigo-400/20 rounded-full filter blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
