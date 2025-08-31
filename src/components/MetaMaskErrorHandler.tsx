'use client';

import { useState } from 'react';
import { useBlockchain } from '../hooks/useBlockchain';
import { 
  ExclamationTriangleIcon, 
  ArrowPathIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';

interface MetaMaskErrorHandlerProps {
  error: string | null;
  onClose?: () => void;
}

export default function MetaMaskErrorHandler({ error, onClose }: MetaMaskErrorHandlerProps) {
  const { resetConnection, isLoading } = useBlockchain();
  const [isResetting, setIsResetting] = useState(false);

  // Check if this is a circuit breaker error
  const isCircuitBreakerError = error?.includes('circuit breaker') || 
                               error?.includes('Execution prevented') ||
                               error?.includes('MetaMask is temporarily unavailable');

  if (!error || !isCircuitBreakerError) {
    return null;
  }

  const handleResetConnection = async () => {
    setIsResetting(true);
    try {
      await resetConnection();
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error('Failed to reset connection:', err);
    } finally {
      setIsResetting(false);
    }
  };

  const handleRefreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">MetaMask Connection Issue</h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          )}
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            MetaMask is experiencing connection issues. This usually happens when there are too many failed requests.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">Try these solutions:</h4>
            <ol className="text-sm text-yellow-800 space-y-1">
              <li>1. Refresh the page</li>
              <li>2. Restart MetaMask</li>
              <li>3. Check your internet connection</li>
              <li>4. Try switching networks in MetaMask</li>
            </ol>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleResetConnection}
            disabled={isResetting || isLoading}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResetting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Resetting...
              </>
            ) : (
              <>
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Reset Connection
              </>
            )}
          </button>
          
          <button
            onClick={handleRefreshPage}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
}
