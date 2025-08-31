'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

interface Web3ContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        // Request account access
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (window.ethereum as any).request({ method: 'eth_requestAccounts' });
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const browserProvider = new ethers.BrowserProvider(window.ethereum as any);
        const userSigner = await browserProvider.getSigner();
        const userAccount = await userSigner.getAddress();
        const network = await browserProvider.getNetwork();

        setProvider(browserProvider);
        setSigner(userSigner);
        setAccount(userAccount);
        setChainId(Number(network.chainId));
        setIsConnected(true);

        // Store connection state
        localStorage.setItem('walletConnected', 'true');
      } else {
        throw new Error('MetaMask is not installed');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setChainId(null);
    setIsConnected(false);
    localStorage.removeItem('walletConnected');
  };

  // Auto-connect on page load if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      if (typeof window !== 'undefined' && window.ethereum && localStorage.getItem('walletConnected')) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const accounts = await (window.ethereum as any).request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await connectWallet();
          }
        } catch (error) {
          console.error('Auto-connect failed:', error);
        }
      }
    };

    autoConnect();
  }, []);

  // Listen for account/network changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          connectWallet();
        }
      };

      const handleChainChanged = (chainId: string) => {
        setChainId(parseInt(chainId, 16));
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.ethereum as any).on('accountsChanged', handleAccountsChanged);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.ethereum as any).on('chainChanged', handleChainChanged);

      return () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window.ethereum as any).removeListener('accountsChanged', handleAccountsChanged);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window.ethereum as any).removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const value: Web3ContextType = {
    provider,
    signer,
    account,
    chainId,
    isConnected,
    connectWallet,
    disconnectWallet,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}