'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  UserCircleIcon,
  PlusIcon,
  HeartIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CalendarIcon,
  MapPinIcon,
  ArrowRightIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useBlockchain } from '../../hooks/useBlockchain';
import { useRouter } from 'next/navigation';

interface Campaign {
  _id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  currency: string;
  status: string;
  endDate: string;
  mainImage?: { url: string };
  progressPercentage: number;
  daysRemaining: number;
  totalDonors: number;
  createdAt: string;
}

interface Donation {
  campaignId: string;
  campaignTitle: string;
  amount: number;
  currency: string;
  donatedAt: string;
  transactionHash: string;
}

export default function DashboardPage() {
  const { isConnected, account, disconnectWallet } = useBlockchain();
  const router = useRouter();
  const [userCampaigns, setUserCampaigns] = useState<Campaign[]>([]);
  const [userDonations, setUserDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'donations'>('campaigns');

  useEffect(() => {
    if (isConnected && account) {
      loadUserData();
    }
  }, [isConnected, account]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      
      // Load user's campaigns
      const campaignsResponse = await fetch(`/api/campaigns?creator=${account}`);
      if (campaignsResponse.ok) {
        const campaignsData = await campaignsResponse.json();
        setUserCampaigns(campaignsData.campaigns || []);
      }
      
      // Load user's donations (we'll need to create this API endpoint)
      const donationsResponse = await fetch(`/api/donations?donor=${account}`);
      if (donationsResponse.ok) {
        const donationsData = await donationsResponse.json();
        setUserDonations(donationsData.donations || []);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
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
          <p className="text-gray-600 mb-6">You need to connect your wallet to view your dashboard.</p>
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
            <Link href="/" className="text-2xl font-bold text-gray-900">
              ClearFund Dashboard
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
              </span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your Dashboard</h1>
          <p className="text-gray-600">Manage your campaigns and track your donations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PlusIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{userCampaigns.filter(c => c.status === 'active').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold text-gray-900">{userDonations.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Raised</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userCampaigns.reduce((sum, campaign) => sum + campaign.currentAmount, 0).toLocaleString()} ETH
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('campaigns')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'campaigns'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Campaigns ({userCampaigns.length})
              </button>
              <button
                onClick={() => setActiveTab('donations')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'donations'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Donations ({userDonations.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading your data...</p>
              </div>
            ) : activeTab === 'campaigns' ? (
              <div>
                {userCampaigns.length === 0 ? (
                  <div className="text-center py-8">
                    <PlusIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
                    <p className="text-gray-600 mb-4">Start your first campaign to raise funds for your project.</p>
                    <Link href="/create-campaign" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      Create Campaign
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userCampaigns.map((campaign) => (
                      <div key={campaign._id} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                            {campaign.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                            campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {campaign.status}
                          </span>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{Math.round(campaign.progressPercentage)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${campaign.progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-gray-600">Raised</p>
                            <p className="font-semibold">{campaign.currency} {campaign.currentAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Goal</p>
                            <p className="font-semibold">{campaign.currency} {campaign.goalAmount.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            <span>{campaign.daysRemaining} days left</span>
                          </div>
                          <div className="flex items-center">
                            <UserGroupIcon className="h-4 w-4 mr-1" />
                            <span>{campaign.totalDonors} donors</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Link 
                            href={`/campaigns/${campaign._id}`}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center"
                          >
                            <EyeIcon className="h-4 w-4 inline mr-1" />
                            View
                          </Link>
                                                     <Link 
                             href={`/campaigns/${campaign._id}/edit`}
                             className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                           >
                             <PencilIcon className="h-4 w-4" />
                           </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {userDonations.length === 0 ? (
                  <div className="text-center py-8">
                    <HeartIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No donations yet</h3>
                    <p className="text-gray-600 mb-4">Start supporting campaigns to see your donation history here.</p>
                    <Link href="/campaigns" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      Browse Campaigns
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userDonations.map((donation, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {donation.campaignTitle}
                            </h3>
                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                              <div className="flex items-center">
                                <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                                <span>{donation.currency} {donation.amount.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                <span>{new Date(donation.donatedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 font-mono">
                              {donation.transactionHash.slice(0, 8)}...{donation.transactionHash.slice(-6)}
                            </span>
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              href="/create-campaign"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <PlusIcon className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Create Campaign</h3>
                <p className="text-sm text-gray-600">Start a new fundraising campaign</p>
              </div>
            </Link>
            
            <Link 
              href="/campaigns"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <EyeIcon className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Browse Campaigns</h3>
                <p className="text-sm text-gray-600">Discover projects to support</p>
              </div>
            </Link>
            
                         <Link 
               href="/profile"
               className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
             >
               <UserCircleIcon className="h-6 w-6 text-blue-600 mr-3" />
               <div>
                 <h3 className="font-medium text-gray-900">Profile Settings</h3>
                 <p className="text-sm text-gray-600">Manage your account</p>
               </div>
             </Link>
             
             <button
               onClick={handleLogout}
               className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors text-left w-full"
             >
               <ArrowRightOnRectangleIcon className="h-6 w-6 text-red-600 mr-3" />
               <div>
                 <h3 className="font-medium text-gray-900">Logout</h3>
                 <p className="text-sm text-gray-600">Disconnect wallet and sign out</p>
               </div>
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
