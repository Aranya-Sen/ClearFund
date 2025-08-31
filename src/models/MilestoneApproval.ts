import mongoose from 'mongoose';

const milestoneApprovalSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  },
  milestoneIndex: {
    type: Number,
    required: true,
  },
  creatorWallet: {
    type: String,
    required: true,
    lowercase: true,
  },
  requestedAmount: {
    type: Number,
    required: true,
  },
  documents: [{
    type: String, // URLs to uploaded documents
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'auto_verified'],
    default: 'pending',
  },
  adminNotes: {
    type: String,
  },
  approvedBy: {
    type: String, // Admin wallet address
  },
  approvedAt: {
    type: Date,
  },
  rejectedBy: {
    type: String, // Admin wallet address
  },
  rejectedAt: {
    type: Date,
  },
  rejectionReason: {
    type: String,
  },
  autoVerifiedAt: {
    type: Date,
  },
  blockchainTransactionHash: {
    type: String, // Transaction hash when verification is requested on blockchain
  },
}, {
  timestamps: true,
});

// Index for faster queries
milestoneApprovalSchema.index({ status: 1, createdAt: -1 });
milestoneApprovalSchema.index({ campaignId: 1, milestoneIndex: 1 });
milestoneApprovalSchema.index({ creatorWallet: 1 });

const MilestoneApproval = mongoose.models.MilestoneApproval || mongoose.model('MilestoneApproval', milestoneApprovalSchema);

export default MilestoneApproval;
