'use client';

import { useState, useEffect } from 'react';
import { useMilestone } from '../hooks/useMilestone';
import { useBlockchain } from '../hooks/useBlockchain';

interface MilestoneApprovalProps {
  campaignId: number;
  milestoneId: number;
  milestoneDescription: string;
  milestoneAmount: string;
  isVerificationRequested: boolean;
  onMilestoneApproved?: () => void;
}

export default function MilestoneApproval({ 
  campaignId, 
  milestoneId, 
  milestoneDescription, 
  milestoneAmount, 
  isVerificationRequested,
  onMilestoneApproved 
}: MilestoneApprovalProps) {
  const [isAdminUser, setIsAdminUser] = useState(false);
  const { isConnected, account, connectWallet, isAdmin } = useBlockchain();
  const { isApproving, approvalError, approveCampaignMilestone, clearError } = useMilestone();

  useEffect(() => {
    checkAdminStatus();
  }, [isConnected, account]);

  const checkAdminStatus = async () => {
    if (isConnected && account) {
      try {
        const adminStatus = await isAdmin();
        setIsAdminUser(adminStatus);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdminUser(false);
      }
    }
  };

  const handleApproveMilestone = async () => {
    clearError();
    
    if (!isConnected) {
      await connectWallet();
      await checkAdminStatus();
      return;
    }

    try {
      await approveCampaignMilestone(campaignId, milestoneId);
      if (onMilestoneApproved) {
        onMilestoneApproved();
      }
    } catch (error) {
      console.error('Approval error:', error);
    }
  };

  if (!isVerificationRequested) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-green-500">
      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
        Milestone Approval Required
      </h4>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Milestone:</p>
            <p className="font-medium">{milestoneDescription}</p>
          </div>
          <div>
            <p className="text-gray-600">Amount:</p>
            <p className="font-medium">${milestoneAmount}</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-blue-700 text-sm">
            <strong>Verification requested.</strong> Please review the evidence and approve if the milestone has been completed satisfactorily.
          </p>
        </div>

        {approvalError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{approvalError}</p>
          </div>
        )}

        {!isAdminUser && isConnected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-700 text-sm">
              Only administrators can approve milestones.
            </p>
          </div>
        )}

        <button
          onClick={handleApproveMilestone}
          disabled={isApproving || (!isAdminUser && isConnected)}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isApproving ? 'Approving...' : 'Approve Milestone'}
        </button>

        {!isConnected && (
          <p className="text-sm text-gray-500 text-center">
            Connect your wallet to approve milestones
          </p>
        )}
      </div>
    </div>
  );
}