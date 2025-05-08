import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const ConnectWallet: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  React.useEffect(() => {
    if (isConnected) {
      navigate('/create-profile');
    }
  }, [isConnected, navigate]);

  const handleSolanaConnect = () => {
    // Handle Solana wallet connection
    console.log('Connecting to Solana wallet');
    navigate('/create-profile');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2 dark:text-white">Connect Your Wallet</h2>
              <p className="text-gray-600 dark:text-gray-300">Choose your preferred wallet to get started</p>
            </div>

            <div className="space-y-4">
              <div className="w-full flex justify-center">
                <ConnectButton />
              </div>

              <button
                onClick={handleSolanaConnect}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <img src="https://cryptologos.cc/logos/solana-sol-logo.svg" alt="Solana" className="w-6 h-6" />
                <span>Connect Solana Wallet</span>
              </button>

              <Link
                to="/"
                className="block w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium text-center transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;