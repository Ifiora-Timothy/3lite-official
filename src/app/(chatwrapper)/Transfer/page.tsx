"use client";
import React from "react";
import { ArrowUpRight, ArrowDownLeft, Wallet, Award } from "lucide-react";
import Button from "@/app/UI/Button";
import { Copy } from "lucide-react";
import TransferModal from "../../modals/TransferModal";

const Dashboard: React.FC = () => {
  const [showTransferModal, setShowTransferModal] = React.useState(false);

  const userWallet = {
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    totalBalance: "$2,456.32",
    tokens: [
      {
        name: "Ethereum",
        symbol: "ETH",
        balance: "1.45",
        usdValue: "$2,105.25",
        icon: "⧫",
      },
      {
        name: "USD Coin",
        symbol: "USDC",
        balance: "250.00",
        usdValue: "$250.00",
        icon: "○",
      },
      {
        name: "Polygon",
        symbol: "MATIC",
        balance: "156.78",
        usdValue: "$101.07",
        icon: "◆",
      },
      {
        name: "3lite Token",
        symbol: "3LITE",
        balance: "340.00",
        usdValue: "TBD",
        icon: "✦",
      },
    ],
    rewards: {
      nfts: 6,
      tokens: 340,
    },
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Assets</h1>
            <div className="flex items-center gap-2 text-sm opacity-70">
              <span className="truncate max-w-[200px]">
                {userWallet.address.substring(0, 6)}...
                {userWallet.address.substring(userWallet.address.length - 4)}
              </span>
              <button
                className="p-1 hover:bg-hover-bg rounded-lg transition-colors"
                aria-label="Copy address"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>

          <Button
            variant="primary"
            icon={<ArrowUpRight size={18} />}
            onClick={() => setShowTransferModal(true)}
          >
            Send
          </Button>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Balance Card */}
          <div className="glass-effect p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary-color/10 flex items-center justify-center">
                <Wallet size={20} className="text-primary-color" />
              </div>
              <div>
                <h2 className="text-sm opacity-70">Total Balance</h2>
                <p className="text-2xl font-bold">{userWallet.totalBalance}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<ArrowUpRight size={16} />}
              >
                Send
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<ArrowDownLeft size={16} />}
              >
                Receive
              </Button>
            </div>
          </div>

          {/* Rewards Card */}
          <div className="glass-effect p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent-color/10 flex items-center justify-center">
                <Award size={20} className="text-accent-color" />
              </div>
              <div>
                <h2 className="text-sm opacity-70">3lite Rewards</h2>
                <p className="text-2xl font-bold">
                  {userWallet.rewards.tokens} 3LITE
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" fullWidth>
              Claim Rewards
            </Button>
          </div>
        </div>

        {/* Tokens List */}
        <div className="glass-effect rounded-lg overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h2 className="font-bold">Your Assets</h2>
          </div>
          <div className="divide-y divide-white/10">
            {userWallet.tokens.map((token, index) => (
              <div
                key={index}
                className="p-4 hover:bg-hover-bg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-color/10 flex items-center justify-center text-lg">
                      {token.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{token.name}</h3>
                      <p className="text-sm opacity-70">
                        {token.balance} {token.symbol}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{token.usdValue}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<ArrowUpRight size={16} />}
                      onClick={() => setShowTransferModal(true)}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <TransferModal onClose={() => setShowTransferModal(false)} />
      )}
    </div>
  );
};

export default Dashboard;
