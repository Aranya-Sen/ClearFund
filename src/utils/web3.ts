import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: unknown;
  }
}

// Retry configuration
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to retry operations
const retryOperation = async <T>(
  operation: () => Promise<T>,
  attempts: number = RETRY_ATTEMPTS
): Promise<T> => {
  for (let i = 0; i < attempts; i++) {
    try {
      return await operation();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`Attempt ${i + 1} failed:`, errorMessage);
      
      // If it's the last attempt, throw the error
      if (i === attempts - 1) {
        throw error;
      }
      
      // Check if it's a circuit breaker error
      if (errorMessage.includes('circuit breaker') || 
          errorMessage.includes('Execution prevented') ||
          (error as { code?: number })?.code === -32603) {
        console.log('Circuit breaker detected, waiting longer before retry...');
        await delay(RETRY_DELAY * (i + 2)); // Exponential backoff
      } else {
        await delay(RETRY_DELAY);
      }
    }
  }
  throw new Error('All retry attempts failed');
};

export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return new ethers.BrowserProvider(window.ethereum as any);
    } catch (error) {
      console.error('Error creating provider:', error);
      return null;
    }
  }
  return null;
};

export const getSigner = async () => {
  const provider = getProvider();
  if (provider) {
    try {
      return await retryOperation(async () => {
        return await provider.getSigner();
      });
    } catch (error) {
      console.error('Error getting signer:', error);
      return null;
    }
  }
  return null;
};

export const switchToSepolia = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    // First, try to get the current chain
    const currentChainId = await retryOperation(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await (window.ethereum as any).request({ method: 'eth_chainId' });
    });

    // If already on Sepolia, return true
    if (currentChainId === '0xaa36a7') {
      return true;
    }

    // Try to switch to Sepolia
    await retryOperation(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await (window.ethereum as any).request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID
      });
    });

    return true;
  } catch (error: unknown) {
    console.error('Error switching to Sepolia:', error);
    
    // If the network doesn't exist, try to add it
    if ((error as { code?: number })?.code === 4902) {
      try {
        await retryOperation(async () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return await (window.ethereum as any).request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia',
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                nativeCurrency: {
                  name: 'Sepolia ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
        });
        return true;
      } catch (addError) {
        console.error('Error adding Sepolia network:', addError);
        throw new Error('Failed to add Sepolia network to MetaMask');
      }
    }
    
    throw new Error('Failed to switch to Sepolia network');
  }
};

export const checkNetworkConnection = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    // Test basic connectivity
    await retryOperation(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await (window.ethereum as any).request({ method: 'eth_blockNumber' });
    });
    return true;
  } catch (error) {
    console.error('Network connection check failed:', error);
    return false;
  }
};

export const resetMetaMaskConnection = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    // Try to reset the connection by requesting accounts again
    await retryOperation(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await (window.ethereum as any).request({ method: 'eth_requestAccounts' });
    });
    return true;
  } catch (error) {
    console.error('Failed to reset MetaMask connection:', error);
    return false;
  }
};

export const formatEther = (wei: string) => {
  return ethers.formatEther(wei);
};

export const parseEther = (ether: string) => {
  return ethers.parseEther(ether);
};