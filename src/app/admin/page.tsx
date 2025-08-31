'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useBlockchain } from '../../hooks/useBlockchain';

interface MilestoneApproval {
  id: string;
  campaignId: string;
  campaignTitle: string;
  creatorName: string;
  creatorWallet: string;
  milestoneIndex: number;
  milestoneTitle: string;
  milestoneDescription: string;
  requestedAmount: number;
  documents: string[];
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  adminNotes?: string;
  campaign?: {
    title: string;
    description: string;
    milestones: Array<{
      title: string;
      description: string;
      targetAmount: number;
    }>;
  };
}

interface AdminStats {
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
  totalAutoVerified: number;
  averageProcessingTime: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { isConnected, account } = useBlockchain();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  console.log('AdminDashboard render - isConnected:', isConnected, 'account:', account);
  const [approvals, setApprovals] = useState<MilestoneApproval[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalPending: 0,
    totalApproved: 0,
    totalRejected: 0,
    totalAutoVerified: 0,
    averageProcessingTime: 0
  });
  const [selectedApproval, setSelectedApproval] = useState<MilestoneApproval | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    console.log('AdminDashboard useEffect - isConnected:', isConnected, 'account:', account);
    
    if (isConnected && account) {
      console.log('Wallet connected, starting admin check...');
      // Add a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        if (isLoading) {
          console.log('Admin check timeout - redirecting to home');
          setIsLoading(false);
          router.push('/');
        }
      }, 10000); // 10 second timeout

      checkAdminStatus();

      return () => clearTimeout(timeoutId);
    } else {
      console.log('Wallet not connected, setting loading to false');
      setIsLoading(false);
    }
  }, [isConnected, account]);

  const checkAdminStatus = async () => {
    try {
      setIsLoading(true);
      console.log('Checking admin status for wallet:', account);
      
      const response = await fetch(`/api/admin/check-status?walletAddress=${account}`);
      console.log('Admin status response:', response.status);
      
      const data = await response.json();
      console.log('Admin status data:', data);
      
      if (response.ok && data.success && data.isAdmin) {
        console.log('User is admin, loading admin data...');
        setIsAdmin(true);
        await loadAdminData();
      } else {
        console.log('User is not admin, redirecting...');
        // Redirect non-admin users
        router.push('/');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      alert('Error checking admin status. Please try again.');
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAdminData = async () => {
    try {
      console.log('Loading admin data...');
      
      // Load pending approvals
      const approvalsResponse = await fetch('/api/admin/approvals');
      console.log('Approvals response status:', approvalsResponse.status);
      
      if (approvalsResponse.ok) {
        const approvalsData = await approvalsResponse.json();
        console.log('Approvals data:', approvalsData);
        
        if (approvalsData.success) {
          setApprovals(approvalsData.approvals);
          setStats(approvalsData.stats);
        } else {
          console.error('Error loading approvals:', approvalsData);
          alert('Error loading admin data. Please refresh the page.');
        }
      } else {
        const errorData = await approvalsResponse.json();
        console.error('Error loading approvals:', errorData);
        alert('Error loading admin data. Please refresh the page.');
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
      alert('Error loading admin data. Please check your connection and try again.');
    }
  };

  const handleViewDetails = (approval: MilestoneApproval) => {
    setSelectedApproval(approval);
    setShowModal(true);
  };

  const handleApprove = async (approvalId: string) => {
    try {
      setProcessingAction(true);
      const response = await fetch(`/api/admin/approvals/${approvalId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminWallet: account,
          adminNotes: 'Approved by admin'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Refresh data
          loadAdminData();
          setShowModal(false);
          setSelectedApproval(null);
        } else {
          alert(`Error: ${result.message || 'Unknown error occurred'}`);
        }
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Error approving milestone:', error);
      alert('Failed to approve milestone');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleReject = async (approvalId: string, reason: string) => {
    try {
      setProcessingAction(true);
      const response = await fetch(`/api/admin/approvals/${approvalId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminWallet: account,
          adminNotes: reason
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Refresh data
          loadAdminData();
          setShowModal(false);
          setSelectedApproval(null);
        } else {
          alert(`Error: ${result.message || 'Unknown error occurred'}`);
        }
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Error rejecting milestone:', error);
      alert('Failed to reject milestone');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleLogout = () => {
    router.push('/');
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShieldCheckIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Wallet Not Connected</h1>
          <p className="text-gray-600 mb-6">Please connect your wallet to access the admin dashboard.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Checking admin status...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShieldCheckIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don&apos;t have admin privileges.</p>
          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
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
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Admin: {account?.slice(0, 6)}...{account?.slice(-4)}
              </span>
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
                 {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApproved}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <XCircleIcon className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRejected}</p>
              </div>
            </div>
          </div>
          
                     <div className="bg-white rounded-lg shadow p-6">
             <div className="flex items-center">
               <ChartBarIcon className="h-8 w-8 text-blue-500" />
               <div className="ml-4">
                 <p className="text-sm font-medium text-gray-600">Avg. Processing</p>
                 <p className="text-2xl font-bold text-gray-900">{stats.averageProcessingTime}h</p>
               </div>
             </div>
           </div>
           
           <div className="bg-white rounded-lg shadow p-6">
             <div className="flex items-center">
               <CheckCircleIcon className="h-8 w-8 text-green-500" />
               <div className="ml-4">
                 <p className="text-sm font-medium text-gray-600">Auto Verified</p>
                 <p className="text-2xl font-bold text-gray-900">{stats.totalAutoVerified}</p>
               </div>
             </div>
           </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Milestone Approvals</h2>
          </div>
          
          {approvals.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">No pending approvals</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creator
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Milestone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requested
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {approvals.map((approval) => (
                    <tr key={approval.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{approval.campaignTitle}</p>
                          <p className="text-sm text-gray-500">ID: {approval.campaignId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{approval.creatorName}</p>
                          <p className="text-sm text-gray-500 font-mono">
                            {approval.creatorWallet.slice(0, 6)}...{approval.creatorWallet.slice(-4)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{approval.milestoneTitle}</p>
                          <p className="text-sm text-gray-500">#{approval.milestoneIndex + 1}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-900">
                          {approval.requestedAmount.toFixed(2)} ETH
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-500">
                          {new Date(approval.requestedAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewDetails(approval)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Approval Modal */}
      {showModal && selectedApproval && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Milestone Approval Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Campaign Information</h4>
                <p className="text-sm text-gray-600">{selectedApproval.campaignTitle}</p>
                <p className="text-sm text-gray-500">ID: {selectedApproval.campaignId}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Creator</h4>
                <p className="text-sm text-gray-600">{selectedApproval.creatorName}</p>
                <p className="text-sm text-gray-500 font-mono">{selectedApproval.creatorWallet}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Milestone Details</h4>
                <p className="text-sm text-gray-600">{selectedApproval.milestoneTitle}</p>
                <p className="text-sm text-gray-500">{selectedApproval.milestoneDescription}</p>
                <p className="text-sm font-medium text-gray-900">
                  Requested Amount: {selectedApproval.requestedAmount.toFixed(2)} ETH
                </p>
              </div>

              {selectedApproval.documents.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900">Verification Documents</h4>
                  <div className="space-y-2">
                    {selectedApproval.documents.map((doc, index) => (
                      <a
                        key={index}
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <DocumentTextIcon className="h-4 w-4 mr-2" />
                        Document {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => handleApprove(selectedApproval.id)}
                  disabled={processingAction}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingAction ? 'Processing...' : 'Approve'}
                </button>
                <button
                  onClick={() => {
                    const reason = prompt('Please provide a reason for rejection:');
                    if (reason) {
                      handleReject(selectedApproval.id, reason);
                    }
                  }}
                  disabled={processingAction}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingAction ? 'Processing...' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
