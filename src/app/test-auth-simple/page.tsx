"use client";

import { useState } from 'react';
import { useBlockchain } from '@/hooks/useBlockchain';
import { 
  CheckCircleIcon, 
  XCircleIcon,
  WalletIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function SimpleTestAuth() {
  const blockchainContext = useBlockchain();
  const { isConnected, account, chainId, connectWallet, disconnectWallet, isLoading, error } = blockchainContext || {};
  const [message, setMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    setMessage('');
    try {
      await connectWallet();
      setMessage('✅ Wallet connected successfully!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setMessage(`❌ Wallet connection failed: ${errorMessage}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    setMessage('✅ Wallet disconnected successfully!');
  };

  const getNetworkName = (chainId: number | null) => {
    if (!chainId) return 'Unknown';
    switch (chainId) {
      case 1: return 'Ethereum Mainnet';
      case 11155111: return 'Sepolia Testnet';
      case 137: return 'Polygon';
      case 80001: return 'Mumbai Testnet';
      default: return `Chain ID: ${chainId}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-teal-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShieldCheckIcon className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Simple Blockchain Test</h1>
          <p className="text-gray-600 text-sm">Test wallet connection and blockchain status</p>
        </div>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold mb-3 flex items-center">
            <WalletIcon className="h-5 w-5 mr-2 text-purple-600" />
            Current Status:
          </h2>
                     <div className="space-y-2 text-sm">
             <p><strong>Connected:</strong> {isConnected ? 'Yes' : 'No'}</p>
             <p><strong>Account:</strong> {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}</p>
             <p><strong>Network:</strong> {getNetworkName(chainId)}</p>
             <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
           </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-800">
              <XCircleIcon className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Error: {error}</span>
            </div>
          </div>
        )}

        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.includes('✅') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              {message.includes('✅') ? (
                <CheckCircleIcon className="h-4 w-4 mr-2" />
              ) : (
                <XCircleIcon className="h-4 w-4 mr-2" />
              )}
              <span className="text-sm font-medium">{message}</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
                     <button
             onClick={handleConnectWallet}
             disabled={isConnecting || isConnected}
             className="w-full bg-gradient-to-r from-purple-600 to-teal-600 text-white p-3 rounded-lg hover:from-purple-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-300"
           >
             {isConnecting ? 'Connecting...' : isConnected ? 'Already Connected' : 'Connect Wallet'}
           </button>
          
                     {isConnected && (
            <button
              onClick={handleDisconnectWallet}
              className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 font-medium transition-colors"
            >
              Disconnect Wallet
            </button>
          )}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="font-semibold mb-2 text-yellow-900">Instructions:</h3>
          <ol className="text-sm space-y-1 list-decimal list-inside text-yellow-800">
            <li>Make sure you have MetaMask installed</li>
            <li>Click &quot;Connect Wallet&quot; to connect</li>
            <li>Check the status to see connection details</li>
            <li>Try disconnect to clear the connection</li>
            <li>Check browser console for any errors</li>
          </ol>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold mb-2 text-blue-900">Supported Networks:</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• Ethereum Mainnet (Chain ID: 1)</p>
            <p>• Sepolia Testnet (Chain ID: 11155111)</p>
            <p>• Polygon (Chain ID: 137)</p>
            <p>• Mumbai Testnet (Chain ID: 80001)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
