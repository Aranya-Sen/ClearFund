'use client';

import { useState } from 'react';
import { useVerification } from '../hooks/useVerification';
import { useBlockchain } from '../hooks/useBlockchain';

interface VerificationFormProps {
  campaignId: number;
  milestoneId: number;
  milestoneDescription: string;
  onVerificationRequested?: () => void;
}

export default function VerificationForm({ 
  campaignId, 
  milestoneId, 
  milestoneDescription, 
  onVerificationRequested 
}: VerificationFormProps) {
  const [evidence, setEvidence] = useState('');
  const { isConnected, account, connectWallet, isCampaignCreator } = useBlockchain();
  const { isRequesting, verificationError, requestMilestoneVerification, clearError } = useVerification();
  const [isCreator, setIsCreator] = useState(false);

  const checkCreatorStatus = async () => {
    if (isConnected && account) {
      const creator = await isCampaignCreator(campaignId);
      setIsCreator(creator);
    }
  };

  const handleRequestVerification = async () => {
    clearError();
    
    if (!isConnected) {
      await connectWallet();
      await checkCreatorStatus();
      return;
    }

    if (!isCreator) {
      clearError();
      return;
    }

    try {
      await requestMilestoneVerification(campaignId, milestoneId);
      setEvidence('');
      if (onVerificationRequested) {
        onVerificationRequested();
      }
    } catch (error) {
      console.error('Verification request error:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Request Verification</h4>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Milestone:</strong> {milestoneDescription}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Evidence Description (Optional)
          </label>
          <textarea
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the evidence you're providing for this milestone completion..."
          />
        </div>

        {verificationError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{verificationError}</p>
          </div>
        )}

        {!isCreator && isConnected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-700 text-sm">
              Only the campaign creator can request verification for milestones.
            </p>
          </div>
        )}

        <button
          onClick={handleRequestVerification}
          disabled={isRequesting || (!isCreator && isConnected)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRequesting ? 'Requesting Verification...' : 'Request Verification'}
        </button>

        {!isConnected && (
          <p className="text-sm text-gray-500 text-center">
            Connect your wallet to request verification
          </p>
        )}
      </div>
    </div>
  );
}