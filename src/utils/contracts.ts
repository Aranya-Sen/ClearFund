import { ethers } from 'ethers';
import ClearFundABI from '../contracts/ClearFundABI.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xc1567832dE21b7d55d7D59C967f79c8e9c288090';

export const getContract = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider = new ethers.BrowserProvider(window.ethereum as any);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, ClearFundABI, signer);
  }
  return null;
};

export const getContractWithProvider = () => {
  if (typeof window !== 'undefined') {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/');
    return new ethers.Contract(CONTRACT_ADDRESS, ClearFundABI, provider);
  }
  return null;
};

// New function to get contract with specific address
export const getContractWithAddress = (contractAddress: string) => {
  if (typeof window !== 'undefined') {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/');
    return new ethers.Contract(contractAddress, ClearFundABI, provider);
  }
  return null;
};

// New function to get contract with signer and specific address
export const getContractWithSignerAndAddress = async (contractAddress: string) => {
  if (typeof window !== 'undefined' && window.ethereum) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider = new ethers.BrowserProvider(window.ethereum as any);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, ClearFundABI, signer);
  }
  return null;
};