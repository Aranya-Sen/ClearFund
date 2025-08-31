import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  walletAddress: {
    type: String,
    required: [true, 'Wallet address is required'],
    unique: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: ['donor', 'creator', 'admin', 'temp'],
    default: 'donor',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  profileImage: {
    type: String,
    default: '',
  },
  kycCompleted: {
    type: Boolean,
    default: false,
  },
  kycData: {
    documentType: String,
    documentNumber: String,
    documentImage: String,
    verifiedAt: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  // Email verification fields
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailOTP: {
    type: String,
    default: null,
  },
  emailOTPExpiry: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Index for faster queries
userSchema.index({ role: 1 });

// Ensure the model is only created once
let User;
if (mongoose.models.User) {
  User = mongoose.models.User;
} else {
  User = mongoose.model('User', userSchema);
}

export default User;
