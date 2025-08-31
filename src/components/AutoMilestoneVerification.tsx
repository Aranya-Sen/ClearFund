'use client';

import { useState } from 'react';
import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useBlockchain } from '../hooks/useBlockchain';

interface AutoMilestoneVerificationProps {
  campaignId: string;
  milestoneIndex: number;
  targetAmount: number;
  currentAmount: number;
  isVerified: boolean;
  onVerificationUpdate: () => void;
  milestones?: Array<{
    title: string;
    description: string;
    targetAmount: number;
  }>;
}

export default function AutoMilestoneVerification({
  campaignId,
  milestoneIndex,
  targetAmount,
  currentAmount,
  isVerified,
  onVerificationUpdate,
  milestones
}: AutoMilestoneVerificationProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'failed'>(
    isVerified ? 'verified' : 'pending'
  );
  const [message, setMessage] = useState('');
  const { isConnected, account } = useBlockchain();

  const handleAutoVerification = async () => {
    if (!isConnected || !account) {
      setMessage('Please connect your wallet first');
      return;
    }

    setIsChecking(true);
    setMessage('');

    try {
      const response = await fetch('/api/milestone-approval/auto-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId,
          milestoneIndex
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setVerificationStatus('verified');
        setMessage('Milestone automatically verified! Target amount reached.');
        onVerificationUpdate();
      } else {
        setVerificationStatus('failed');
        setMessage(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Error during auto-verification:', error);
      setVerificationStatus('failed');
      setMessage('Error during verification. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  // Calculate cumulative target for this milestone
  const calculateCumulativeTarget = () => {
    if (!milestones) return targetAmount;
    let cumulative = 0;
    for (let i = 0; i <= milestoneIndex; i++) {
      cumulative += milestones[i].targetAmount;
    }
    return cumulative;
  };

  const cumulativeTarget = calculateCumulativeTarget();
  const progressPercentage = Math.min((currentAmount / cumulativeTarget) * 100, 100);
  const isTargetReached = currentAmount >= cumulativeTarget;

  return (
    <div className="bg-white rounded-lg border p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">
          Milestone {milestoneIndex + 1} Verification
        </h3>
        {verificationStatus === 'verified' && (
          <div className="flex items-center text-green-600">
            <CheckCircleIcon className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Verified</span>
          </div>
        )}
      </div>

             <div className="mb-4">
         <div className="flex justify-between text-sm text-gray-600 mb-1">
           <span>Progress: {currentAmount.toFixed(2)} / {cumulativeTarget.toFixed(2)} ETH</span>
           <span>{progressPercentage.toFixed(1)}%</span>
         </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isTargetReached ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {verificationStatus === 'verified' ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              Milestone automatically verified on {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {isTargetReached ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-blue-800 font-medium">
                    Target amount reached! Ready for verification.
                  </span>
                </div>
                <button
                  onClick={handleAutoVerification}
                  disabled={isChecking}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isChecking ? (
                    <>
                      <ClockIcon className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Automatically'
                  )}
                </button>
              </div>
            </div>
          ) : (
                         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
               <div className="flex items-center">
                 <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                 <span className="text-yellow-800">
                   Need {(cumulativeTarget - currentAmount).toFixed(2)} more ETH to reach cumulative target
                 </span>
               </div>
             </div>
          )}

          {message && (
            <div className={`rounded-lg p-3 ${
              verificationStatus === 'failed' 
                ? 'bg-red-50 border border-red-200 text-red-800' 
                : 'bg-blue-50 border border-blue-200 text-blue-800'
            }`}>
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
