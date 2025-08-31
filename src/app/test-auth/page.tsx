"use client";

import { useState } from 'react';
import { useBlockchain } from '@/hooks/useBlockchain';
import { 
  CheckCircleIcon, 
  XCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  UserIcon,
  LockClosedIcon,
  WalletIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export default function TestAuthPage() {
  const blockchainContext = useBlockchain();
  const { isConnected, account, chainId, contract, provider, signer, connectWallet, disconnectWallet, isLoading, error } = blockchainContext || {};
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-teal-600 bg-clip-text text-transparent mb-2">
              Blockchain Test Page
            </h1>
            <p className="text-gray-600 text-lg">
              Test the blockchain integration and wallet connectivity
            </p>
          </div>

          {/* Current Status */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <WalletIcon className="h-6 w-6 mr-2" />
              Current Blockchain Status
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 w-32">Loading:</span>
                  {isLoading ? (
                    <div className="flex items-center text-yellow-600">
                      <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                      Loading...
                    </div>
                  ) : (
                    <div className="flex items-center text-green-600">
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Ready
                    </div>
                  )}
                </div>
                
                                 <div className="flex items-center">
                   <span className="font-semibold text-gray-700 w-32">Connected:</span>
                   {isConnected ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Yes
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <XCircleIcon className="h-5 w-5 mr-2" />
                      No
                    </div>
                  )}
                </div>
                
                                 <div className="flex items-center">
                   <span className="font-semibold text-gray-700 w-32">Account:</span>
                   {account ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Connected
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <XCircleIcon className="h-5 w-5 mr-2" />
                      Not Connected
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 w-32">Contract:</span>
                  {contract ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Loaded
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <XCircleIcon className="h-5 w-5 mr-2" />
                      Not Loaded
                    </div>
                  )}
                </div>
              </div>
              
              {isConnected && account && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Wallet Details:</h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>Address:</strong> {account}</p>
                    <p><strong>Network:</strong> {getNetworkName(chainId)}</p>
                    <p><strong>Chain ID:</strong> {chainId || 'Unknown'}</p>
                    <p><strong>Provider:</strong> {provider ? 'Available' : 'Not Available'}</p>
                    <p><strong>Signer:</strong> {signer ? 'Available' : 'Not Available'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Test Controls */}
          <div className="space-y-6">
            <div className="bg-purple-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-purple-900 mb-4 flex items-center">
                <LockClosedIcon className="h-6 w-6 mr-2" />
                Wallet Controls
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Connect Wallet */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3">Connect Wallet</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Connect your MetaMask or other Web3 wallet to interact with the platform.
                  </p>
                  <button
                    onClick={handleConnectWallet}
                    disabled={isConnecting || isConnected}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isConnecting ? 'Connecting...' : isConnected ? 'Already Connected' : 'Connect Wallet'}
                  </button>
                </div>

                {/* Disconnect Wallet */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3">Disconnect Wallet</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Disconnect your wallet from the application.
                  </p>
                  <button
                    onClick={handleDisconnectWallet}
                    disabled={!isConnected}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <XCircleIcon className="h-5 w-5 mr-2 text-red-600" />
                  <span className="font-medium text-red-800">Error: {error}</span>
                </div>
              </div>
            )}

            {/* Message Display */}
            {message && (
              <div className={`rounded-lg p-4 ${
                message.includes('✅') 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <div className="flex items-center">
                  {message.includes('✅') ? (
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 mr-2" />
                  )}
                  <span className="font-medium">{message}</span>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">Testing Instructions:</h3>
            <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
              <li>Make sure you have MetaMask or another Web3 wallet installed</li>
              <li>Click &quot;Connect Wallet&quot; to connect your wallet</li>
              <li>Verify that the wallet status shows as connected</li>
              <li>Check that your account address is displayed</li>
              <li>Test the disconnect functionality</li>
              <li>Check the browser console for any blockchain-related errors</li>
            </ol>
          </div>

          {/* Network Information */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Supported Networks:</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Ethereum Mainnet:</strong> Chain ID 1</p>
              <p><strong>Sepolia Testnet:</strong> Chain ID 11155111 (Recommended for testing)</p>
              <p><strong>Polygon:</strong> Chain ID 137</p>
              <p><strong>Mumbai Testnet:</strong> Chain ID 80001</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
