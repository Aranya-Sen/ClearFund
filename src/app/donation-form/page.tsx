'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBlockchain } from '../../hooks/useBlockchain';
import DonationForm from '../../components/DonationForm';

export default function DonationFormPage() {
  const params = useParams();
  const router = useRouter();
  const { getCampaign } = useBlockchain();
  const [campaign, setCampaign] = useState<{ title: string; description: string; goalAmount: number; currentAmount: number; currency: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCampaign();
  }, [params.id]);

  const loadCampaign = async () => {
    try {
      const campaignId = parseInt(params.id as string);
      if (campaignId) {
        const campaignData = await getCampaign(campaignId);
        setCampaign({
          title: String(campaignData.title || 'Unknown Campaign'),
          description: String(campaignData.description || ''),
          goalAmount: parseFloat(campaignData.goal || '0'),
          currentAmount: parseFloat(campaignData.totalRaised || '0'),
          currency: 'ETH'
        });
      }
    } catch (error) {
      console.error('Error loading campaign:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDonationSuccess = () => {
    // Refresh campaign data after donation
    loadCampaign();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Campaign not found</h1>
          <button 
            onClick={() => router.push('/campaigns')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Support {campaign.title}</h1>
          <p className="mt-2 text-gray-600">Your donation helps make this project a reality</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Campaign Info */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About this Campaign</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">Description</h3>
                <p className="text-gray-600 mt-1">{campaign.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Goal</h3>
                  <p className="text-gray-600">${campaign.goalAmount}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Raised</h3>
                  <p className="text-gray-600">${campaign.currentAmount}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">Creator</h3>
                <p className="text-gray-600">Unknown Creator</p>
              </div>
            </div>
          </div>

          {/* Donation Form */}
          <DonationForm
            campaignId={parseInt(params.id as string)}
            campaignGoal={campaign.goalAmount.toString()}
            campaignRaised={campaign.currentAmount.toString()}
            onDonationSuccess={handleDonationSuccess}
          />
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push(`/campaigns/${params.id}`)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Campaign Details
          </button>
        </div>
      </div>
    </div>
  );
}