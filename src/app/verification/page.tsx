'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useBlockchain } from '../../hooks/useBlockchain';

interface VerificationRequest {
  campaignId: number;
  milestoneId: number;
  campaignTitle: string;
  creator: string;
  milestoneTitle: string;
  amount: string;
  status: 'pending' | 'approved' | 'rejected';
  description: string;
  riskScore: number;
}

export default function VerificationPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getAllCampaigns, getMilestones, getVerificationStatus, approveMilestone } = useBlockchain();

  useEffect(() => {
    loadVerificationRequests();
  }, []);

  const loadVerificationRequests = async () => {
    try {
      setIsLoading(true);
      const campaigns = await getAllCampaigns();
      const requests: VerificationRequest[] = [];

      for (const campaign of campaigns) {
        const milestones = await getMilestones(campaign.id);
        
        for (let i = 0; i < milestones.length; i++) {
          const isVerified = await getVerificationStatus(campaign.id, i);
          
          if (isVerified) {
            requests.push({
              campaignId: campaign.id,
              milestoneId: i,
              campaignTitle: campaign.title || `Campaign ${campaign.id}`,
              creator: campaign.creator,
              milestoneTitle: `Milestone ${i + 1}`,
              amount: milestones[i].amount,
              status: milestones[i].isApproved ? 'approved' : milestones[i].isCompleted ? 'rejected' : 'pending',
              description: milestones[i].description,
              riskScore: 0.15 // Placeholder for AI risk scoring
            });
          }
        }
      }

      setVerificationRequests(requests);
    } catch (error) {
      console.error('Error loading verification requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (campaignId: number, milestoneId: number) => {
    try {
      await approveMilestone(campaignId, milestoneId);
      await loadVerificationRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error approving milestone:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircleIcon className="h-5 w-5" />;
      case 'rejected': return <XCircleIcon className="h-5 w-5" />;
      case 'pending': return <ClockIcon className="h-5 w-5" />;
      default: return <ClockIcon className="h-5 w-5" />;
    }
  };

  const getRiskLevel = (score: number) => {
    if (score < 0.2) return { level: 'Low', color: 'text-green-600 bg-green-100' };
    if (score < 0.4) return { level: 'Medium', color: 'text-yellow-600 bg-yellow-100' };
    return { level: 'High', color: 'text-red-600 bg-red-100' };
  };

  const filteredRequests = verificationRequests.filter(req => 
    activeTab === 'all' || req.status === activeTab
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Verification & Audit</h1>
              <p className="mt-2 text-gray-600">Review and approve milestone submissions</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                Admin Access
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  {[
                    { id: 'pending', label: 'Pending Review', count: verificationRequests.filter(r => r.status === 'pending').length },
                    { id: 'approved', label: 'Approved', count: verificationRequests.filter(r => r.status === 'approved').length },
                    { id: 'all', label: 'All Requests', count: verificationRequests.length }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                      <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Verification Requests */}
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div key={`${request.campaignId}-${request.milestoneId}`} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{request.milestoneTitle}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1 capitalize">{request.status}</span>
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevel(request.riskScore).color}`}>
                            Risk: {getRiskLevel(request.riskScore).level}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Campaign:</strong> {request.campaignTitle}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Creator:</strong> {request.creator.slice(0, 8)}...{request.creator.slice(-6)}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        <strong>Amount:</strong> ${request.amount}
                      </p>
                      
                      <p className="text-gray-700 mb-4">{request.description}</p>

                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View Details
                        </button>
                        {request.status === 'pending' && (
                          <button 
                            onClick={() => handleApprove(request.campaignId, request.milestoneId)}
                            className="flex items-center text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Approve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Reviews</span>
                  <span className="font-medium">{verificationRequests.filter(r => r.status === 'pending').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Approved Today</span>
                  <span className="font-medium text-green-600">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Requests</span>
                  <span className="font-medium">{verificationRequests.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Request Details */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Milestone Verification Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Campaign Information</h4>
                  <p className="text-sm text-gray-600">Title: {selectedRequest.campaignTitle}</p>
                  <p className="text-sm text-gray-600">Creator: {selectedRequest.creator}</p>
                  <p className="text-sm text-gray-600">Milestone: {selectedRequest.milestoneTitle}</p>
                  <p className="text-sm text-gray-600">Amount: ${selectedRequest.amount}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Description</h4>
                  <p className="text-sm text-gray-600">{selectedRequest.description}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Risk Assessment</h4>
                  <p className="text-sm text-gray-600">
                    Risk Score: {selectedRequest.riskScore} ({getRiskLevel(selectedRequest.riskScore).level})
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400"
                >
                  Close
                </button>
                {selectedRequest.status === 'pending' && (
                  <button 
                    onClick={() => handleApprove(selectedRequest.campaignId, selectedRequest.milestoneId)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}