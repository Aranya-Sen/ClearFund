# Database and Cloudinary Setup Guide

This guide will help you set up MongoDB and Cloudinary integration for your crowdfunding platform.

## 🔧 Prerequisites

1. **MongoDB Atlas Account**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string

2. **Cloudinary Account**
   - Sign up at [Cloudinary](https://cloudinary.com/)
   - Get your Cloud Name, API Key, and API Secret

## 📝 Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://aranyasen993_db_user:<your_actual_password>@cluster0.pxdxdkf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key_here
NEXTAUTH_URL=http://localhost:3000
```

### 🔑 Getting Your Credentials

#### MongoDB Atlas:
1. Go to your MongoDB Atlas dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<your_actual_password>` with your database user password

#### Cloudinary:
1. Go to your Cloudinary dashboard
2. Navigate to "Settings" > "Access Keys"
3. Copy your Cloud Name, API Key, and API Secret

## 🚀 Features Implemented

### ✅ Database Models

1. **User Model** (`/src/models/User.ts`)
   - User registration and authentication
   - Wallet address linking
   - KYC status tracking
   - Role-based access (donor/creator)

2. **Campaign Model** (`/src/models/Campaign.ts`)
   - Campaign creation and management
   - Image storage with Cloudinary
   - Donation tracking
   - Milestone management
   - Location and category support

### ✅ API Routes

1. **Authentication APIs**
   - `POST /api/auth/signup` - User registration
   - `POST /api/auth/login` - User login

2. **Campaign APIs**
   - `GET /api/campaigns` - List all campaigns
   - `POST /api/campaigns` - Create new campaign
   - `GET /api/campaigns/[id]` - Get single campaign
   - `PUT /api/campaigns/[id]` - Update campaign

### ✅ Frontend Integration

1. **Signup Page** - Now saves user data to MongoDB
2. **Login Page** - Validates user against database
3. **Campaign Creation** - Stores campaign data and images
4. **Campaign Display** - Retrieves and displays campaigns

## 🖼️ Image Upload Features

### Cloudinary Integration
- Automatic image optimization
- Multiple image support for campaigns
- Secure image storage
- CDN delivery for fast loading

### Supported Features
- Main campaign image
- Additional campaign images
- Image captions
- Automatic resizing and compression

## 🔐 Security Features

1. **Input Validation** - All API endpoints validate input data
2. **Error Handling** - Comprehensive error handling and user feedback
3. **Data Sanitization** - Email and wallet addresses are normalized
4. **Unique Constraints** - Prevents duplicate users and campaigns

## 📊 Database Schema

### User Collection
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  walletAddress: String (unique),
  role: String (enum: ['donor', 'creator']),
  profileImage: String,
  kycCompleted: Boolean,
  kycData: Object,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Campaign Collection
```javascript
{
  title: String,
  description: String,
  shortDescription: String,
  category: String,
  goalAmount: Number,
  currentAmount: Number,
  currency: String,
  images: Array,
  mainImage: Object,
  creator: ObjectId (ref: User),
  creatorWalletAddress: String,
  status: String,
  startDate: Date,
  endDate: Date,
  location: Object,
  tags: Array,
  milestones: Array,
  updates: Array,
  donors: Array,
  totalDonors: Number,
  isVerified: Boolean,
  verificationData: Object,
  blockchainData: Object,
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing the Setup

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test User Registration:**
   - Go to `/signup`
   - Connect your wallet
   - Fill in the form
   - Submit and check MongoDB for the new user

3. **Test User Login:**
   - Go to `/login`
   - Connect your wallet
   - Should redirect to home if user exists, or to signup if not

4. **Test Campaign Creation:**
   - Create a campaign with images
   - Check MongoDB for campaign data
   - Check Cloudinary for uploaded images

## 🔍 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Check your connection string
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Verify your database user credentials

2. **Cloudinary Upload Error**
   - Check your Cloudinary credentials
   - Ensure your Cloudinary account is active
   - Check file size limits

3. **API Route Not Found**
   - Ensure all API files are in the correct locations
   - Check that the development server is running
   - Verify the API route paths

### Debug Mode:
Add console.log statements in the API routes to debug issues:
```javascript
console.log('Request body:', body);
console.log('Database connection:', await dbConnect());
```

## 📈 Next Steps

1. **Add Campaign Management UI**
2. **Implement Donation System**
3. **Add KYC Verification Flow**
4. **Create Admin Dashboard**
5. **Add Email Notifications**
6. **Implement Search and Filtering**

## 🆘 Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the terminal for server errors
3. Verify your environment variables
4. Test the API endpoints directly

For additional help, refer to the MongoDB and Cloudinary documentation.
