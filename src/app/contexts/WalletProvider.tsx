"use client";

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { PropsWithChildren, useMemo } from 'react';

// Default styles for the wallet UI

import "@solana/wallet-adapter-react-ui/styles.css";

export function WalletConnectionProvider({ children }: PropsWithChildren) {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  
  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking
  // and lazy loading -- Only the wallets you configure here will be compiled into your application
  const wallets = useMemo(
    () => [
      new SolflareWalletAdapter()
    ],
    [network]
  );

  
  return (
    <ConnectionProvider  endpoint={endpoint}>
      <WalletProvider  wallets={wallets} autoConnect  localStorageKey='wallet_connected'>
        <WalletModalProvider >{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}