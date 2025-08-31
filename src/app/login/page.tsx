"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBlockchain } from '@/hooks/useBlockchain';
import { 
  ShieldCheckIcon,
  WalletIcon,
  LockClosedIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';



export default function LoginPage() {
  const router = useRouter();
  const blockchainContext = useBlockchain();
  const { isConnected, account, connectWallet, isLoading: blockchainLoading, error } = blockchainContext || {};


  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<'donor' | 'creator' | null>(null);
  const [showRoleBanner, setShowRoleBanner] = useState(false);



  const handleConnectWallet = async () => {
    setIsLoading(true);
    try {
      console.log('Attempting to connect wallet...');
      await connectWallet();
      console.log('Connect wallet called, checking account:', account);
      if (account) {
        console.log('Account found, updating wallet login state');


      } else {
        console.log('No account found after connection attempt');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };



  const handleWalletLogin = async () => {
    setIsLoading(true);
    try {
      console.log('Wallet login started. Current state:', { isConnected, account });
      
      // If not connected, connect first
      if (!isConnected) {
        console.log('Wallet not connected, attempting to connect...');
        await handleConnectWallet();
        // Wait a bit for the connection to be established
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('After connection attempt:', { isConnected, account });
      }

      // Check if connection was successful by checking the context again
      if (blockchainContext?.isConnected && blockchainContext?.account) {
        console.log('Wallet connected successfully, checking user in database...');
        
        // Check if user exists in database
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress: blockchainContext.account
          }),
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok) {
          console.log('User found in database:', loginData.user);
          setUserRole(loginData.user.role);
          setShowRoleBanner(true);
          // Redirect to home page after successful wallet login
          setTimeout(() => {
            router.push('/');
          }, 1500);
        } else {
          console.log('User not found in database, redirecting to signup...');
          alert('Account not found. Please sign up first.');
          router.push('/signup');
        }
      } else {
        console.log('Wallet connection failed. Context state:', blockchainContext);
        throw new Error('Wallet connection failed. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in with wallet:', error);
      alert(error instanceof Error ? error.message : 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };



  // Show loading state if blockchain context is not ready
  if (!blockchainContext) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blockchain connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-teal-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-2 border-purple-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <Link href="/" className="text-4xl font-bold flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-purple-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
                <ShieldCheckIcon className="h-7 w-7 text-white" />
              </div>
              <span className="text-purple-700">Clear</span>
              <span className="text-teal-600">Fund</span>
            </Link>
            <Link href="/signup" className="text-gray-800 hover:text-purple-700 font-semibold text-lg px-6 py-3 bg-gradient-to-r from-purple-50 to-teal-50 rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-all duration-300">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Role Banner */}
      {showRoleBanner && userRole && (
        <div className="bg-green-50 border border-green-200 rounded-lg mx-4 mt-4 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800 text-sm">
                <strong>Successfully signed in as:</strong> {userRole === 'donor' ? 'Donor / Funder' : 'Campaign Creator'}
              </p>
            </div>
            <button
              onClick={() => setShowRoleBanner(false)}
              className="text-green-600 hover:text-green-800"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Blockchain Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg mx-4 mt-4 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800 text-sm">
                <strong>Blockchain Error:</strong> {error}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-red-600 hover:text-red-800"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Trust Indicators */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl p-6 mb-10 shadow-lg">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
              <ShieldCheckIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-blue-900 text-lg font-semibold">
                <strong>Secure Login:</strong> All transactions are protected by Ethereum smart contracts and blockchain transparency.
              </p>
              <p className="text-blue-700 text-sm mt-1">Your account is secured with blockchain-level protection</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-purple-100">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-700 to-teal-600 bg-clip-text text-transparent mb-4">Welcome Back</h1>
            <p className="text-xl text-gray-600">Connect your wallet to sign in to ClearFund</p>
          </div>





          {/* Wallet Login */}
            <div className="space-y-6">
              {!isConnected ? (
                <div className="text-center py-8">
                  <WalletIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
                  <p className="text-gray-600 mb-6">
                    Connect your Ethereum wallet to sign in securely
                  </p>
                  <button
                    onClick={handleConnectWallet}
                    disabled={isLoading || blockchainLoading}
                    className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center mx-auto"
                  >
                    <WalletIcon className="h-5 w-5 mr-2" />
                    {isLoading || blockchainLoading ? 'Connecting...' : 'Connect Wallet'}
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    Supports MetaMask, WalletConnect, Coinbase Wallet, and more
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                      <h3 className="text-sm font-semibold text-green-800">Wallet Connected</h3>
                    </div>
                    <p className="text-sm text-green-700 font-mono break-all">
                      {account}
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 mr-2" />
                      <p className="text-blue-800 text-sm">
                        <strong>Multi-Factor Authentication:</strong> You may be prompted to verify your identity.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleWalletLogin}
                    disabled={isLoading}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In with Wallet'}
                    {!isLoading && <ArrowRightIcon className="h-4 w-4 ml-2" />}
                  </button>
                </div>
              )}
            </div>

          {/* Security Note */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <LockClosedIcon className="h-5 w-5 text-gray-600 mr-2" />
              <p className="text-gray-700 text-sm">
                <strong>Security:</strong> Your wallet connection is secured by blockchain-level encryption and smart contract verification.
              </p>
            </div>
          </div>
        </div>
      </div>




    </div>
  );
}
