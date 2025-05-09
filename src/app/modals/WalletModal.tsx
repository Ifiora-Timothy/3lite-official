import { useWallet } from "@solana/wallet-adapter-react";
import { SolflareWalletName } from "@solana/wallet-adapter-wallets";
import clsx from "clsx";
import { useEffect } from "react";

export default function WalletModal({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}) {
    const {select,connected}= useWallet();
  const handleConnect = () => {
  select(SolflareWalletName);

  };
  useEffect(() => {
    if (connected) {
      setShowModal(false);
    }
  }, [connected]);


  return (
    <div
      className={clsx(
        "items-center justify-center w-screen absolute z-40 top-0 left-0 bg-opacity-95 h-screen bg-gray-900",
        {
          hidden: !showModal,
          flex: showModal,
        }
      )}
    >
      <div className="items-center justify-center w-96 bg-gray-900">
        <div className="bg-gray-800 rounded-lg p-8 max-w-lg w-full shadow-lg border border-gray-700">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            Connect to Chat
          </h2>

          <button
            onClick={handleConnect}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md font-medium transition-colors"
          >
            Connect
          </button>

          <p className="text-gray-400 text-sm text-center mt-4">
            Connect to start chatting
          </p>
        </div>
      </div>
    </div>
  );
}
