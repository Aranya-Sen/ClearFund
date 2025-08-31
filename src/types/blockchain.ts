import { ReactNode } from "react";

export interface Campaign {
  description: ReactNode;
  title: string | undefined;
  image: string;
  id: number;
  creator: string;
  goal: string;
  totalRaised: string;
  deadline: number;
  isActive: boolean;
}

export interface Milestone {
  description: string;
  amount: string;
  isApproved: boolean;
  isCompleted: boolean;
}

export interface CampaignWithMilestones extends Campaign {
  milestones: Milestone[];
}

export interface Web3State {
  isConnected: boolean;
  account: string | null;
  contract: unknown | null;
  provider: unknown | null;
  signer: unknown | null;
  chainId: number | null;
}

export interface BlockchainContextType extends Web3State {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  resetConnection: () => Promise<void>;
  resetCircuitBreaker: () => Promise<void>;
  createCampaign: (goal: string, durationInDays: number, milestoneDescriptions: string[], milestoneAmounts: string[]) => Promise<unknown>;
  donate: (campaignId: number, amount: string) => Promise<unknown>;
  requestVerification: (campaignId: number, milestoneId: number) => Promise<unknown>;
  approveMilestone: (campaignId: number, milestoneId: number) => Promise<unknown>;
  getCampaign: (campaignId: number) => Promise<Campaign>;
  getMilestones: (campaignId: number) => Promise<Milestone[]>;
  getCampaignCounter: () => Promise<number>;
  getCurrentCampaignCounter: () => Promise<number>;
  getAllCampaigns: () => Promise<Campaign[]>;
  isAdmin: () => Promise<boolean>;
  isCampaignCreator: (campaignId: number) => Promise<boolean>;
  getVerificationStatus: (campaignId: number, milestoneId: number) => Promise<boolean>;
  isCampaignActive: (campaignId: number) => Promise<boolean>;
  getTotalMilestones: (campaignId: number) => Promise<number>;
  listenForCampaignCreated: (callback: (campaignId: number, creator: string, goal: string, deadline: number) => void) => void;
  listenForDonationReceived: (callback: (campaignId: number, donor: string, amount: string) => void) => void;
  listenForVerificationRequested: (callback: (campaignId: number, milestoneId: number) => void) => void;
  listenForMilestoneApproved: (callback: (campaignId: number, milestoneId: number) => void) => void;
  removeAllListeners: () => void;
  isLoading: boolean;
  error: string | null;
}