import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Campaign title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Campaign description is required'],
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: 200,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Technology', 'Healthcare', 'Education', 'Environment', 'Arts', 'Community', 'Other'],
  },
  goalAmount: {
    type: Number,
    required: [true, 'Goal amount is required'],
    min: 0,
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  currency: {
    type: String,
    default: 'ETH',
    enum: ['ETH', 'USD', 'EUR'],
  },
  images: [{
    url: String,
    publicId: String,
    caption: String,
  }],
  mainImage: {
    url: String,
    publicId: String,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required'],
  },
  creatorWalletAddress: {
    type: String,
    required: [true, 'Creator wallet address is required'],
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'cancelled'],
    default: 'draft',
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  location: {
    country: String,
    city: String,
    address: String,
  },
  tags: [String],
  milestones: [{
    title: String,
    description: String,
    targetAmount: Number,
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: Date,
  }],
  updates: [{
    title: String,
    content: String,
    image: {
      url: String,
      publicId: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  donors: [{
    walletAddress: String,
    amount: Number,
    transactionHash: String,
    donatedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  totalDonors: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationData: {
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: Date,
    notes: String,
  },
  blockchainData: {
    contractAddress: String,
    campaignId: Number,
    totalTransactions: {
      type: Number,
      default: 0,
    },
  },
}, {
  timestamps: true,
});

// Indexes for faster queries
campaignSchema.index({ status: 1, endDate: 1 });
campaignSchema.index({ creator: 1 });
campaignSchema.index({ category: 1 });
campaignSchema.index({ tags: 1 });
campaignSchema.index({ 'location.country': 1, 'location.city': 1 });

// Virtual for progress percentage
campaignSchema.virtual('progressPercentage').get(function() {
  if (this.goalAmount === 0) return 0;
  return Math.min((this.currentAmount / this.goalAmount) * 100, 100);
});

// Virtual for days remaining
campaignSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const end = new Date(this.endDate);
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
});

// Ensure virtuals are serialized
campaignSchema.set('toJSON', { virtuals: true });
campaignSchema.set('toObject', { virtuals: true });

const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema);

export default Campaign;
