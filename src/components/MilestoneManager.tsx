'use client';

import { useState, useEffect } from 'react';
import { useBlockchain } from '../hooks/useBlockchain';
import { Milestone } from '../types/blockchain';
import VerificationForm from './VerificationForm';
import MilestoneApproval from './MilestoneApproval';

interface MilestoneManagerProps {
  campaignId: number;
  campaignCreator: string;
  milestones: Milestone[];
  onUpdate?: () => void;
}

export default function MilestoneManager({ campaignId, campaignCreator, milestones, onUpdate }: MilestoneManagerProps) {
  const [verificationStatus, setVerificationStatus] = useState<boolean[]>([]);
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);
  const { isConnected, account, connectWallet, getVerificationStatus } = useBlockchain();

  useEffect(() => {
    loadVerificationStatus();
  }, [campaignId, milestones]);

  const loadVerificationStatus = async () => {
    try {
      const statuses = await Promise.all(
        milestones.map((_, index) => getVerificationStatus(campaignId, index))
      );
      setVerificationStatus(statuses);
    } catch (error) {
      console.error('Error loading verification status:', error);
    }
  };

  const handleUpdate = () => {
    loadVerificationStatus();
    if (onUpdate) onUpdate();
  };

  const isUserCreator = () => {
    return account?.toLowerCase() === campaignCreator.toLowerCase();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Milestone Management</h3>
      
      <div className="space-y-6">
        {milestones.map((milestone, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900">Milestone {index + 1}</h4>
                <p className="text-gray-600 mt-1">{milestone.description}</p>
                <p className="text-sm text-gray-500 mt-1">Amount: ${milestone.amount}</p>
              </div>
              <div className="text-right">
                <div className="flex flex-col items-end space-y-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    milestone.isCompleted 
                      ? 'bg-green-100 text-green-800' 
                      : milestone.isApproved 
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {milestone.isCompleted ? 'Completed' : milestone.isApproved ? 'Approved' : 'Pending'}
                  </span>
                  {verificationStatus[index] && (
                    <span className="bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full text-xs">
                      Verification Requested
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              {/* Verification Form (for creator) */}
              {isUserCreator() && !milestone.isCompleted && !verificationStatus[index] && (
                <VerificationForm
                  campaignId={campaignId}
                  milestoneId={index}
                  milestoneDescription={milestone.description}
                  onVerificationRequested={handleUpdate}
                />
              )}

              {/* Approval Section (for admin) */}
              {verificationStatus[index] && !milestone.isApproved && (
                <MilestoneApproval
                  campaignId={campaignId}
                  milestoneId={index}
                  milestoneDescription={milestone.description}
                  milestoneAmount={milestone.amount}
                  isVerificationRequested={verificationStatus[index]}
                  onMilestoneApproved={handleUpdate}
                />
              )}

              {milestone.isApproved && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-700 text-sm font-medium">
                    ✓ This milestone has been approved and funds have been released to the campaign creator.
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!isConnected && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            Connect your wallet to manage milestones
          </p>
          <button
            onClick={connectWallet}
            className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700"
          >
            Connect Wallet
          </button>
        </div>
      )}
    </div>
  );
}