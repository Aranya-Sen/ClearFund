'use client';

import { useState } from 'react';
import { useDonation } from '../hooks/useDonation';
import { useBlockchain } from '../hooks/useBlockchain';

interface DonationFormProps {
  campaignId: number;
  campaignGoal: string;
  campaignRaised: string;
  onDonationSuccess?: () => void;
}

export default function DonationForm({ campaignId, campaignGoal, campaignRaised, onDonationSuccess }: DonationFormProps) {
  const [amount, setAmount] = useState('');
  const { isConnected, account, connectWallet } = useBlockchain();
  const { isDonating, donationError, makeDonation, clearError } = useDonation();

  const handleDonate = async () => {
    clearError();
    
    try {
      await makeDonation(campaignId, amount);
      setAmount('');
      if (onDonationSuccess) {
        onDonationSuccess();
      }
    } catch (error) {
      // Error is handled in the hook
      console.error('Donation error:', error);
    }
  };

  const progressPercentage = campaignGoal !== "0" 
    ? (parseFloat(campaignRaised) / parseFloat(campaignGoal)) * 100 
    : 0;

  const suggestedAmounts = [0.1, 0.5, 1, 5];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Support this Campaign</h3>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Raised: ${parseFloat(campaignRaised).toLocaleString()}</span>
          <span className="text-gray-900 font-medium">{Math.min(Math.round(progressPercentage), 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Goal: ${parseFloat(campaignGoal).toLocaleString()}
        </p>
      </div>

      {/* Donation Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Donation Amount (ETH)
          </label>
          
          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {suggestedAmounts.map((suggestedAmount) => (
              <button
                key={suggestedAmount}
                onClick={() => setAmount(suggestedAmount.toString())}
                className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Ξ{suggestedAmount}
              </button>
            ))}
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Ξ</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.1"
              min="0"
              step="0.001"
            />
          </div>
        </div>

        {donationError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{donationError}</p>
          </div>
        )}

        <button
          onClick={handleDonate}
          disabled={isDonating}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isDonating ? 'Processing Donation...' : isConnected ? 'Donate Now' : 'Connect Wallet to Donate'}
        </button>

        {!isConnected && (
          <p className="text-sm text-gray-500 text-center">
            You need to connect your wallet to make a donation
          </p>
        )}

        {isConnected && (
          <p className="text-xs text-gray-400 text-center">
            Connected as: {account?.slice(0, 8)}...{account?.slice(-6)}
          </p>
        )}
      </div>
    </div>
  );
}