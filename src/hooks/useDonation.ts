import { useState } from 'react';
import { useBlockchain } from './useBlockchain';

export const useDonation = () => {
  const [isDonating, setIsDonating] = useState(false);
  const [donationError, setDonationError] = useState<string | null>(null);
  const { donate, isConnected, connectWallet } = useBlockchain();

  const makeDonation = async (campaignId: number, amount: string) => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setDonationError('Please enter a valid donation amount');
      return;
    }

    setIsDonating(true);
    setDonationError(null);

    try {
      const receipt = await donate(campaignId, amount);
      return receipt;
    } catch (error: unknown) {
              const errorMessage = error instanceof Error ? error.message : String(error);
        setDonationError(errorMessage || 'Donation failed');
      throw error;
    } finally {
      setIsDonating(false);
    }
  };

  return {
    isDonating,
    donationError,
    makeDonation,
    clearError: () => setDonationError(null)
  };
};