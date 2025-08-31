"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useBlockchain } from '@/hooks/useBlockchain';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  UserIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  WalletIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'donor' | 'creator';
  walletAddress: string;
}

export default function SimpleSignUpPage() {
  const { isConnected, account, connectWallet } = useBlockchain();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'donor',
    walletAddress: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConnectWallet = async () => {
    setIsConnectingWallet(true);
    setErrorMessage('');
    try {
      await connectWallet();
      if (account) {
        setFormData(prev => ({ ...prev, walletAddress: account }));
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setErrorMessage(`Wallet connection failed: ${errorMessage}`);
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !account) {
      setErrorMessage('Please connect your wallet first');
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // In a real implementation, you would save user data to your backend
      // For now, we'll just simulate success
      setTimeout(() => {
        setSignupSuccess(true);
        setIsLoading(false);
      }, 2000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setErrorMessage(errorMessage);
      setIsLoading(false);
    }
  };

  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-teal-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to ClearFund!</h1>
          <p className="text-gray-600 mb-6">
            Your account has been created successfully. You can now start exploring campaigns.
          </p>
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors inline-block"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/campaigns"
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors inline-block"
            >
              Browse Campaigns
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ShieldCheckIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-teal-600 bg-clip-text text-transparent mb-2">
            Join ClearFund
          </h1>
          <p className="text-gray-600">
            Create your account and start making a difference
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Wallet Connection */}
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="flex items-center mb-3">
              <WalletIcon className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="font-semibold text-purple-900">Wallet Connection</h3>
            </div>
            {isConnected && account ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center text-green-800">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Wallet Connected</span>
                </div>
                <p className="text-xs text-green-600 mt-1 font-mono">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConnectWallet}
                disabled={isConnectingWallet}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                {isConnectingWallet ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I want to be a:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('role', 'donor')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.role === 'donor'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <CurrencyDollarIcon className="h-6 w-6 mr-2" />
                    <span className="font-medium">Donor</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Support campaigns</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('role', 'creator')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.role === 'creator'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <BuildingOfficeIcon className="h-6 w-6 mr-2" />
                    <span className="font-medium">Creator</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Create campaigns</p>
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center text-red-800">
                <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                <span className="text-sm">{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !isConnected}
            className="w-full bg-gradient-to-r from-purple-600 to-teal-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
