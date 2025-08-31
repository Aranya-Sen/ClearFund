'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  UserCircleIcon,
  ArrowLeftIcon,
  PencilIcon,
  ShieldCheckIcon,
  WalletIcon,
  EnvelopeIcon,
  CalendarIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useBlockchain } from '../../hooks/useBlockchain';
import { useRouter } from 'next/navigation';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  walletAddress: string;
  role: 'donor' | 'creator';
  kycCompleted: boolean;
  createdAt: string;
  profileImage: string | null;
  lastLogin?: string;
}

export default function ProfilePage() {
  const { isConnected, account, disconnectWallet } = useBlockchain();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isConnected && account) {
      loadUserProfile();
    }
  }, [isConnected, account]);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/user/profile?walletAddress=${account}`);
      const data = await response.json();

      if (response.ok) {
        setUser({
          ...data.user,
          profileImage: data.user.profileImage || null
        });
      } else {
        console.error('Error fetching user profile:', data.error);
        // Set default user data if profile not found
        setUser({
          firstName: 'User',
          lastName: 'Account',
          email: 'Email not set',
          walletAddress: account || 'Unknown Wallet',
          role: 'donor',
          kycCompleted: false,
          createdAt: new Date().toISOString(),
          profileImage: null
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Set default user data on error
      setUser({
        firstName: 'User',
        lastName: 'Account',
        email: 'Email not set',
        walletAddress: account || 'Unknown Wallet',
        role: 'donor',
        kycCompleted: false,
        createdAt: new Date().toISOString(),
        profileImage: null
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await disconnectWallet();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <UserCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Connect Your Wallet</h1>
          <p className="text-gray-600 mb-6">You need to connect your wallet to view your profile.</p>
          <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Connect Wallet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Back to Home
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading profile...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="h-12 w-12 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-gray-600 mb-4">{user?.email}</p>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user?.role === 'creator' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user?.role}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user?.kycCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user?.kycCompleted ? 'KYC Verified' : 'KYC Pending'}
                    </span>
                  </div>
                </div>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <PencilIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-8 py-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <WalletIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Wallet Address</p>
                      <p className="text-sm text-gray-600 font-mono">
                        {account?.slice(0, 6)}...{account?.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Connected</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Email Address</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Change
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Member Since</p>
                      <p className="text-sm text-gray-600">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-8 py-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Security & Privacy</h3>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">KYC Verification</p>
                      <p className="text-sm text-gray-600">
                        {user?.kycCompleted ? 'Your identity has been verified' : 'Complete KYC to unlock all features'}
                      </p>
                    </div>
                  </div>
                  <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    user?.kycCompleted 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                    {user?.kycCompleted ? 'Verified' : 'Complete KYC'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <WalletIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Wallet Connection</p>
                      <p className="text-sm text-gray-600">Manage your wallet connection</p>
                    </div>
                  </div>
                                     <button 
                     onClick={handleLogout}
                     className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                   >
                     Logout
                   </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link 
                  href="/dashboard"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <UserCircleIcon className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">View Dashboard</h4>
                    <p className="text-sm text-gray-600">Manage your campaigns and donations</p>
                  </div>
                </Link>
                
                <Link 
                  href="/create-campaign"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <PencilIcon className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Create Campaign</h4>
                    <p className="text-sm text-gray-600">Start a new fundraising project</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
