export interface Campaign {
  creator: string;
  goal: bigint;
  totalRaised: bigint;
  deadline: bigint;
  isActive: boolean;
}

export interface Milestone {
  description: string;
  amount: bigint;
  isApproved: boolean;
  isCompleted: boolean;
}

export interface CampaignWithId extends Campaign {
  id: number;
}

export interface CampaignFormData {
  title: string;
  description: string;
  goal: string;
  durationInDays: string;
  milestones: {
    description: string;
    amount: string;
  }[];
}