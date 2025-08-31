'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  HeartIcon,
  ShareIcon,
  UserIcon,
  CalendarIcon,
  MapPinIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useBlockchain } from '../../../hooks/useBlockchain';
import AutoMilestoneVerification from '../../../components/AutoMilestoneVerification';

// Campaign interface for database data
interface DBCampaign {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  goalAmount: number;
  currentAmount: number;
  currency: string;
  images: Array<{ url: string; publicId: string; caption: string }>;
  mainImage: { url: string; publicId: string } | null;
  creator: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  creatorWalletAddress: string;
  status: string;
  startDate: string;
  endDate: string;
  location: {
    country: string;
    city: string;
    address: string;
  };
  tags: string[];
  milestones: Array<{
    title: string;
    description: string;
    targetAmount: number;
    isCompleted: boolean;
    completedAt?: string;
  }>;
  donors: Array<{
    walletAddress: string;
    amount: number;
    transactionHash: string;
    donatedAt: string;
  }>;
  blockchainData: {
    contractAddress: string;
    campaignId: number;
    totalTransactions: number;
  };
  isVerified: boolean;
  totalDonors: number;
  createdAt: string;
  updatedAt: string;
  progressPercentage: number;
  daysRemaining: number;
}

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params.id as string;
  
  const { 
    isConnected, 
    account, 
    connectWallet, 
    donate, 
    requestVerification,
    resetCircuitBreaker,
    getCampaign,
    createCampaign,
    getCurrentCampaignCounter,
    getMilestones,
    getVerificationStatus,
    error: blockchainError
  } = useBlockchain();
  
  const [campaign, setCampaign] = useState<DBCampaign | null>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDonating, setIsDonating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blockchainExists, setBlockchainExists] = useState<boolean | null>(null);
  const [isCheckingBlockchain, setIsCheckingBlockchain] = useState(false);
  const [isRedeploying, setIsRedeploying] = useState(false);
  const [verifiedMilestones, setVerifiedMilestones] = useState<Set<number>>(new Set());
  const [autoVerifiedMilestones, setAutoVerifiedMilestones] = useState<Set<number>>(new Set());
  const [isLoadingMilestones, setIsLoadingMilestones] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (campaignId) {
      loadCampaignData();
      checkAdminStatus();
    }
  }, [campaignId]);

  useEffect(() => {
    if (campaign) {
      checkAutoVerifiedMilestones();
    }
  }, [campaign]);

  const loadCampaignData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch campaign from database API
      const response = await fetch(`/api/campaigns/${campaignId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Campaign not found');
      }
      
      setCampaign(data.campaign);
      
      // Check if campaign exists on blockchain
      if (data.campaign?.blockchainData?.campaignId) {
        await checkBlockchainCampaign(data.campaign.blockchainData.campaignId);
      }
    } catch (error) {
      console.error('Error loading campaign data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load campaign');
    } finally {
      setIsLoading(false);
    }
  };

  const checkBlockchainCampaign = async (blockchainCampaignId: number) => {
    if (!isConnected) return;
    
    setIsCheckingBlockchain(true);
    try {
      await getCampaign(blockchainCampaignId);
      setBlockchainExists(true);
      
      // Check which milestones are already verified
      await checkVerifiedMilestones(blockchainCampaignId);
    } catch (error) {
      console.log('Campaign does not exist on blockchain:', error);
      setBlockchainExists(false);
    } finally {
      setIsCheckingBlockchain(false);
    }
  };

  const checkVerifiedMilestones = async (blockchainCampaignId: number) => {
    if (!isConnected) return;
    
    setIsLoadingMilestones(true);
    try {
      const verifiedSet = new Set<number>();
      
      // Check each milestone for verification status
      const milestonesLength = campaign?.milestones?.length || 0;
      for (let i = 0; i < milestonesLength; i++) {
        try {
          const isVerified = await getVerificationStatus(blockchainCampaignId, i);
          if (isVerified) {
            verifiedSet.add(i);
          }
        } catch (error) {
          console.log(`Error checking verification status for milestone ${i}:`, error);
        }
      }
      
      setVerifiedMilestones(verifiedSet);
      console.log('Verified milestones:', Array.from(verifiedSet));
    } catch (error) {
      console.error('Error checking verified milestones:', error);
    } finally {
      setIsLoadingMilestones(false);
    }
  };

  const checkAdminStatus = async () => {
    if (!account) return;
    
    try {
      const response = await fetch(`/api/admin/check-status?walletAddress=${account}`);
      const data = await response.json();
      
      if (response.ok && data.success && data.isAdmin) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const checkAutoVerifiedMilestones = async () => {
    if (!campaign) return;
    
    try {
      const autoVerifiedSet = new Set<number>();
      
      for (let i = 0; i < campaign.milestones.length; i++) {
        const response = await fetch('/api/milestone-approval/check-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            campaignId: campaign._id,
            milestoneIndex: i
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'auto_verified') {
            autoVerifiedSet.add(i);
          }
        }
      }
      
      setAutoVerifiedMilestones(autoVerifiedSet);
    } catch (error) {
      console.error('Error checking auto-verified milestones:', error);
    }
  };

  const handleDonate = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }

    // Check if campaign has blockchain data
    if (!campaign?.blockchainData?.campaignId) {
      alert('This campaign is not yet deployed on blockchain. Please try again later.');
      return;
    }

    // Check if campaign exists on blockchain
    if (blockchainExists === false) {
      alert('This campaign no longer exists on the blockchain (likely due to a blockchain reset). Please contact the campaign creator to redeploy it.');
      return;
    }

    setIsDonating(true);
    try {
      // Use the blockchain campaign ID, not the MongoDB ID
      const result = await donate(campaign.blockchainData.campaignId, donationAmount);
      
      // Check if this was a simulated donation
      if ((result as unknown as { simulated?: boolean }).simulated) {
        // Update the database for simulated donations
        try {
          const response = await fetch(`/api/campaigns/${campaign._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              currentAmount: campaign.currentAmount + parseFloat(donationAmount),
              donors: [
                ...campaign.donors,
                {
                  walletAddress: account,
                  amount: parseFloat(donationAmount),
                  transactionHash: (result as unknown as { hash?: string }).hash || 'unknown',
                  donatedAt: new Date().toISOString()
                }
              ]
            })
          });
          
          if (response.ok) {
            const newTotalAmount = campaign.currentAmount + parseFloat(donationAmount);
            const progressPercentage = Math.min((newTotalAmount / campaign.goalAmount) * 100, 100);
            alert(`Simulated donation successful! Campaign updated in database.\n\nNew total raised: ${campaign.currency} ${newTotalAmount.toLocaleString()}\nProgress: ${Math.round(progressPercentage)}%`);
          } else {
            alert('Donation simulated but database update failed.');
          }
        } catch (dbError) {
          console.error('Database update error:', dbError);
          alert('Donation simulated but database update failed.');
        }
      } else {
        // For real blockchain donations, update the database with the new amount
        try {
          const newTotalAmount = campaign.currentAmount + parseFloat(donationAmount);
          const response = await fetch(`/api/campaigns/${campaign._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              currentAmount: newTotalAmount,
              donors: [
                ...campaign.donors,
                {
                  walletAddress: account,
                  amount: parseFloat(donationAmount),
                  transactionHash: (result as unknown as { hash?: string }).hash || 'unknown',
                  donatedAt: new Date().toISOString()
                }
              ]
            })
          });
          
          if (response.ok) {
            const newTotalAmount = campaign.currentAmount + parseFloat(donationAmount);
            const progressPercentage = Math.min((newTotalAmount / campaign.goalAmount) * 100, 100);
            alert(`Donation successful! Campaign updated in database.\n\nNew total raised: ${campaign.currency} ${newTotalAmount.toLocaleString()}\nProgress: ${Math.round(progressPercentage)}%`);
          } else {
            console.error('Database update failed for blockchain donation');
          }
        } catch (dbError) {
          console.error('Database update error for blockchain donation:', dbError);
        }
      }
      
      setDonationAmount('');
      
      // Update the local campaign state immediately for better UX
      if (campaign && account) {
        const newTotalAmount = campaign.currentAmount + parseFloat(donationAmount);
        setCampaign({
          ...campaign,
          currentAmount: newTotalAmount,
          donors: [
            ...campaign.donors,
            {
              walletAddress: account,
              amount: parseFloat(donationAmount),
              transactionHash: (result as unknown as { hash?: string }).hash || 'unknown',
              donatedAt: new Date().toISOString()
            }
          ]
        });
      }
      
      // Refresh campaign data to update total raised
      await loadCampaignData();
    } catch (error) {
      console.error('Error donating:', error);
      alert('Donation failed. Please try again.');
    } finally {
      setIsDonating(false);
    }
  };

  const handleRequestVerification = async (milestoneId: number) => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    // Check if campaign has blockchain data
    if (!campaign?.blockchainData?.campaignId) {
      alert('This campaign is not yet deployed on blockchain. Please try again later.');
      return;
    }

    try {
      await requestVerification(campaign.blockchainData.campaignId, milestoneId);
      alert('Verification requested successfully!');
      // Refresh milestones data
      await loadCampaignData();
    } catch (error) {
      console.error('Error requesting verification:', error);
      alert('Failed to request verification. Please try again.');
    }
  };



  const handleRedeployCampaign = async () => {
    if (!campaign) return;
    
    setIsRedeploying(true);
    try {
      // Prepare milestone data for blockchain
      const milestoneDescriptions = campaign.milestones.map(m => m.description);
      const milestoneAmounts = campaign.milestones.map(m => m.targetAmount.toString());
      
      // Create campaign on blockchain
      const result = await createCampaign(
        campaign.goalAmount.toString(),
        Math.ceil((new Date(campaign.endDate).getTime() - new Date(campaign.startDate).getTime()) / (1000 * 60 * 60 * 24)),
        milestoneDescriptions,
        milestoneAmounts
      );
      
      // Get the new campaign ID from the result
      const newCampaignId = (result as unknown as { campaignId?: number }).campaignId || Date.now();
      
      // Update the campaign in the database with the new blockchain ID
      const response = await fetch(`/api/campaigns/${campaign._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blockchainData: {
            ...campaign.blockchainData,
            campaignId: newCampaignId,
            totalTransactions: 0
          }
        })
      });
      
      if (response.ok) {
        alert(`Campaign successfully redeployed on blockchain with ID: ${newCampaignId}`);
        // Refresh campaign data
        await loadCampaignData();
      } else {
        throw new Error('Failed to update campaign in database');
      }
      
    } catch (error) {
      console.error('Error redeploying campaign:', error);
      alert('Failed to redeploy campaign. Please try again.');
    } finally {
      setIsRedeploying(false);
    }
  };

  const syncCampaignWithBlockchain = async () => {
    if (!campaign?.blockchainData?.campaignId) return;
    
    try {
      // Get the campaign data from blockchain
      const blockchainCampaign = await getCampaign(campaign.blockchainData.campaignId);
      
      // Update the database with blockchain data
      const response = await fetch(`/api/campaigns/${campaign._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentAmount: parseFloat(blockchainCampaign.totalRaised),
          blockchainData: {
            ...campaign.blockchainData,
            totalTransactions: campaign.blockchainData.totalTransactions + 1
          }
        })
      });
      
      if (response.ok) {
        alert('Campaign data synced with blockchain successfully!');
        await loadCampaignData();
      } else {
        alert('Failed to sync campaign data with blockchain.');
      }
    } catch (error) {
      console.error('Error syncing campaign with blockchain:', error);
      alert('Failed to sync campaign data with blockchain.');
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error loading campaign</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/campaigns" className="text-blue-600 hover:underline">
            Back to campaigns
          </Link>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Campaign not found</h1>
          <Link href="/campaigns" className="text-blue-600 hover:underline">
            Back to campaigns
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation - Same as before */}
      {/* ... existing navigation ... */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Blockchain Status Warning */}
        {blockchainExists === false && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  Blockchain Campaign Not Found
                </h3>
                <p className="text-yellow-700 mb-4">
                  This campaign exists in our database but is no longer available on the blockchain. 
                  This typically happens when the local blockchain network is reset. 
                  Donations are currently disabled for this campaign.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => checkBlockchainCampaign(campaign.blockchainData.campaignId)}
                    disabled={isCheckingBlockchain}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700 disabled:opacity-50"
                  >
                    {isCheckingBlockchain ? 'Checking...' : 'Check Again'}
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const counter = await getCurrentCampaignCounter();
                        alert(`Current blockchain campaign counter: ${counter}\nCampaign ID in database: ${campaign.blockchainData.campaignId}`);
                      } catch (error) {
                        alert('Error getting counter: ' + error);
                      }
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                  >
                    Debug Counter
                  </button>
                  <button
                    onClick={syncCampaignWithBlockchain}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700"
                  >
                    Sync with Blockchain
                  </button>
                  <button
                    onClick={() => campaign?.blockchainData?.campaignId && checkVerifiedMilestones(campaign.blockchainData.campaignId)}
                    disabled={isLoadingMilestones}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {isLoadingMilestones ? 'Checking...' : 'Refresh Verification Status'}
                  </button>
                  {campaign.creatorWalletAddress.toLowerCase() === account?.toLowerCase() && (
                    <button
                      onClick={handleRedeployCampaign}
                      disabled={isRedeploying || !isConnected}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                    >
                      {isRedeploying ? 'Redeploying...' : 'Redeploy Campaign'}
                    </button>
                  )}
                  <Link
                    href="/campaigns"
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
                  >
                    Browse Other Campaigns
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Back Button */}
            <div className="mb-6">
              <Link
                href="/campaigns"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Campaigns
              </Link>
            </div>
            
            {/* Campaign Image */}
            <div className="relative">
              <img
                src={campaign.mainImage?.url || campaign.images[0]?.url || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=500&fit=crop"}
                alt={campaign.title}
                className="w-full h-96 object-cover rounded-2xl"
              />
              {campaign.status === 'active' && (
                <div className="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-lg">
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Active
                </div>
              )}
              {campaign.isVerified && (
                <div className="absolute top-6 left-6 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-lg">
                  <ShieldCheckIcon className="h-4 w-4 mr-2" />
                  Verified
                </div>
              )}
            </div>

            {/* Campaign Info */}
            <div className="bg-white rounded-2xl shadow-xl p-10">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {campaign.title}
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {campaign.description}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <button className="p-4 text-gray-400 hover:text-red-500 transition-colors border border-gray-200 rounded-xl hover:border-red-200">
                    <HeartIcon className="h-7 w-7" />
                  </button>
                  <button className="p-4 text-gray-400 hover:text-blue-600 transition-colors border border-gray-200 rounded-xl hover:border-blue-200">
                    <ShareIcon className="h-7 w-7" />
                  </button>
                </div>
              </div>

              {/* Creator Info */}
              <div className="flex items-center space-x-6 p-6 bg-gray-50 rounded-2xl mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  {campaign.creator.profileImage ? (
                    <img 
                      src={campaign.creator.profileImage} 
                      alt={`${campaign.creator.firstName} ${campaign.creator.lastName}`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-8 w-8 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="text-base text-gray-500">Created by</p>
                  <p className="text-xl font-semibold text-gray-900">{campaign.creator.firstName} {campaign.creator.lastName}</p>
                  <p className="text-sm text-gray-600">{campaign.creator.email}</p>
                </div>
              </div>

              {/* Campaign Details */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-base text-gray-500">Funding Goal</p>
                  <p className="text-2xl font-bold text-gray-900">{campaign.currency} {campaign.goalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-base text-gray-500">Raised</p>
                  <p className="text-2xl font-bold text-gray-900">{campaign.currency} {campaign.currentAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-base text-gray-500">Deadline</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {new Date(campaign.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-base text-gray-500">Status</p>
                  <p className="text-xl font-semibold text-gray-900 capitalize">
                    {campaign.status}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                {(() => {
                  const progressPercentage = campaign.goalAmount > 0 
                    ? Math.min((campaign.currentAmount / campaign.goalAmount) * 100, 100)
                    : 0;
                  return (
                    <>
                      <div className="flex justify-between text-base mb-3">
                        <span className="text-gray-600">{campaign.currency} {campaign.currentAmount.toLocaleString()} raised</span>
                        <span className="text-gray-900 font-bold">{Math.round(progressPercentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                        <div 
                          className="bg-blue-600 h-4 rounded-full" 
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-base text-gray-500">
                        of {campaign.currency} {campaign.goalAmount.toLocaleString()} goal
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Milestones */}
            <div className="bg-white rounded-2xl shadow-xl p-10">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Project Milestones</h3>
              <div className="space-y-8">
                {campaign.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium ${
                      milestone.isCompleted ? 'bg-green-500 text-white' :
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {milestone.isCompleted ? '✓' : index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xl font-semibold text-gray-900">{milestone.title}</h4>
                        <div className="text-right">
                          <span className="text-base text-gray-500">{campaign.currency} {milestone.targetAmount.toLocaleString()}</span>
                          <div className="text-sm text-gray-400">
                            Cumulative: {campaign.milestones.slice(0, index + 1).reduce((sum, m) => sum + m.targetAmount, 0).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-base mb-3">{milestone.description}</p>
                      
                      {/* Milestone Status Indicators */}
                      {milestone.isCompleted && (
                        <div className="mb-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Milestone Completed
                          </span>
                          {milestone.completedAt && (
                            <span className="ml-2 text-sm text-gray-500">
                              Completed on {new Date(milestone.completedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {verifiedMilestones.has(index) && !milestone.isCompleted && (
                        <div className="mb-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            <ShieldCheckIcon className="h-4 w-4 mr-1" />
                            Verification Requested
                          </span>
                        </div>
                      )}
                      
                      {isLoadingMilestones && (
                        <div className="mb-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            <div className="animate-spin rounded-full h-4 w-4 mr-1 border-b-2 border-gray-600"></div>
                            Checking verification status...
                          </span>
                        </div>
                      )}
                      
                      {/* Auto Verification Component */}
                      <AutoMilestoneVerification
                        campaignId={campaign._id}
                        milestoneIndex={index}
                        targetAmount={milestone.targetAmount}
                        currentAmount={campaign.currentAmount}
                        isVerified={autoVerifiedMilestones.has(index)}
                        milestones={campaign.milestones}
                        onVerificationUpdate={() => {
                          checkAutoVerifiedMilestones();
                          // Refresh campaign data to get updated amounts
                          loadCampaignData();
                        }}
                      />
                      
                      <div className="flex space-x-4 mt-4">
                        {/* Only show Request Verification button if:
                            1. User is an ADMIN
                            2. Milestone is NOT completed
                            3. Milestone is NOT already verified
                            4. Milestone is NOT auto-verified
                            5. Blockchain exists
                            6. User is connected */}
                        {isAdmin && 
                         !milestone.isCompleted && 
                         !verifiedMilestones.has(index) &&
                         !autoVerifiedMilestones.has(index) &&
                         blockchainExists !== false && 
                         isConnected && (
                          <button
                            onClick={() => handleRequestVerification(index)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                          >
                            Request Verification (Admin Only)
                          </button>
                        )}
                        
                        {/* Show message for completed milestones */}
                        {milestone.isCompleted && (
                          <span className="text-sm text-gray-500 italic">
                            This milestone has been completed and verified.
                          </span>
                        )}
                        
                        {/* Show message for already verified milestones */}
                        {verifiedMilestones.has(index) && !milestone.isCompleted && (
                          <span className="text-sm text-gray-500 italic">
                            Verification has already been requested for this milestone.
                          </span>
                        )}
                        
                        {/* Show message for auto-verified milestones */}
                        {autoVerifiedMilestones.has(index) && !milestone.isCompleted && (
                          <span className="text-sm text-green-600 italic">
                            This milestone has been automatically verified.
                          </span>
                        )}
                        
                        {/* Admin functionality would go here */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Donation Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Support this project</h3>
              
              {/* Progress */}
              <div className="mb-8">
                {(() => {
                  const progressPercentage = campaign.goalAmount > 0 
                    ? Math.min((campaign.currentAmount / campaign.goalAmount) * 100, 100)
                    : 0;
                  return (
                    <>
                      <div className="flex justify-between text-base mb-3">
                        <span className="text-gray-600">{campaign.currency} {campaign.currentAmount.toLocaleString()}</span>
                        <span className="text-gray-900 font-bold">{Math.round(progressPercentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                        <div 
                          className="bg-blue-600 h-4 rounded-full" 
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-base text-gray-500">
                        raised of {campaign.currency} {campaign.goalAmount.toLocaleString()} goal
                      </p>
                    </>
                  );
                })()}
              </div>

              {/* Donation Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-3">
                    Donation amount (ETH)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      placeholder="0.1"
                      disabled={blockchainExists === false}
                    />
                  </div>
                </div>
                
                {(() => {
                  // Check if campaign is fully funded
                  const isFullyFunded = campaign && campaign.milestones && campaign.milestones.length > 0
                    ? campaign.milestones.reduce((sum, milestone) => sum + milestone.targetAmount, 0) <= campaign.currentAmount
                    : campaign && campaign.currentAmount >= campaign.goalAmount;
                  
                  return (
                    <button
                      onClick={handleDonate}
                      disabled={isDonating || !isConnected || blockchainExists === false || isFullyFunded}
                      className="w-full bg-blue-600 text-white py-5 px-8 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDonating ? 'Processing...' : 
                       blockchainExists === false ? 'Donations Disabled' :
                       isFullyFunded ? 'Funding Goal Reached' :
                       isConnected ? 'Donate Now' : 'Connect Wallet to Donate'}
                    </button>
                  );
                })()}
                
                {blockchainError && blockchainError.includes('circuit breaker') && (
                  <div className="space-y-2 mt-3">
                    <button
                      onClick={resetCircuitBreaker}
                      className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 transition-colors text-sm"
                    >
                      Reset MetaMask Circuit Breaker
                    </button>
                    <button
                      onClick={() => {
                        alert('Please wait 2-3 minutes for the circuit breaker to reset automatically, then try donating again.');
                        window.location.reload();
                      }}
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors text-xs"
                    >
                      Wait & Retry Later
                    </button>
                  </div>
                )}
                
                <p className="text-sm text-gray-500 text-center">
                  Your donation will be held in escrow until milestones are verified.
                </p>
              </div>
            </div>

            {/* Project Info */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-6">Project Info</h4>
              <div className="space-y-4">
                <div className="flex items-center text-base text-gray-600">
                  <CalendarIcon className="h-5 w-5 mr-4" />
                  <span>Created {new Date(campaign.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-base text-gray-600">
                  <UserIcon className="h-5 w-5 mr-4" />
                  <span>{campaign.creator.firstName} {campaign.creator.lastName}</span>
                </div>
                <div className="flex items-center text-base text-gray-600">
                  <MapPinIcon className="h-5 w-5 mr-4" />
                  <span>{campaign.location.city}, {campaign.location.country}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}