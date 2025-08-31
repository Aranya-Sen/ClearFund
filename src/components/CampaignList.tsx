'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useBlockchain } from '../hooks/useBlockchain';
import { Campaign } from '../types/blockchain';

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getAllCampaigns, listenForCampaignCreated, listenForDonationReceived } = useBlockchain();

  useEffect(() => {
    loadCampaigns();
    setupEventListeners();
    
    return () => {
      // Clean up listeners
    };
  }, []);

  const loadCampaigns = async () => {
    try {
      setIsLoading(true);
      const allCampaigns = await getAllCampaigns();
      setCampaigns(allCampaigns);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupEventListeners = () => {
    listenForCampaignCreated((campaignId, creator, goal, deadline) => {
      console.log('New campaign created:', campaignId);
      loadCampaigns(); // Refresh the list
    });

    listenForDonationReceived((campaignId, donor, amount) => {
      console.log('Donation received for campaign:', campaignId);
      loadCampaigns(); // Refresh to update raised amount
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-3 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => {
        const progressPercentage = campaign.goal !== "0" 
          ? (parseFloat(campaign.totalRaised) / parseFloat(campaign.goal)) * 100 
          : 0;
        
        const isActive = campaign.isActive && 
          (campaign.deadline * 1000) > Date.now();

        return (
          <div key={campaign.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                Campaign #{campaign.id}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {isActive ? 'Active' : 'Ended'}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Raised: ${parseFloat(campaign.totalRaised).toLocaleString()}</span>
                <span className="text-gray-900 font-medium">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Goal: ${parseFloat(campaign.goal).toLocaleString()}
              </p>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              <p>Creator: {campaign.creator.slice(0, 8)}...{campaign.creator.slice(-6)}</p>
              <p>Deadline: {new Date(campaign.deadline * 1000).toLocaleDateString()}</p>
            </div>

            <Link 
              href={`/campaigns/${campaign.id}`}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-center block hover:bg-blue-700 transition-colors"
            >
              View Campaign
            </Link>
          </div>
        );
      })}

      {campaigns.length === 0 && (
        <div className="col-span-full text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No campaigns yet</h3>
          <p className="text-gray-600 mb-6">Be the first to create a campaign!</p>
          <Link 
            href="/create-campaign"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Create First Campaign
          </Link>
        </div>
      )}
    </div>
  );
}