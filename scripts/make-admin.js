const mongoose = require('mongoose');

// Try to load environment variables from .env.local if it exists
try {
  require('dotenv').config({ path: '.env.local' });
} catch (error) {
  console.log('No .env.local file found, using default connection string');
}

// Use the same MongoDB URI as the main application
let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // Fallback to the same connection string as in db.ts
  MONGODB_URI = 'mongodb+srv://aranyasen993_db_user:<db_password>@cluster0.pxdxdkf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  console.log('⚠️  Using default MongoDB connection string.');
  console.log('⚠️  Please replace <db_password> with your actual MongoDB password in the script.');
}

// Check if the connection string still has the placeholder
if (MONGODB_URI.includes('<db_password>')) {
  console.error('❌ Error: MongoDB connection string contains placeholder <db_password>');
  console.error('Please replace <db_password> with your actual MongoDB password.');
  console.error('');
  console.error('You can either:');
  console.error('1. Create a .env.local file with: MONGODB_URI=your_connection_string');
  console.error('2. Or edit this script and replace <db_password> with your actual password');
  process.exit(1);
}

// User schema (simplified version)
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  walletAddress: String,
  role: {
    type: String,
    enum: ['donor', 'creator', 'admin'],
    default: 'donor',
  },
  isAdmin: Boolean,
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

async function makeUserAdmin(walletAddress) {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    // Find user by wallet address
    console.log('Searching for user with wallet address:', walletAddress);
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (!user) {
      console.log('❌ User not found with wallet address:', walletAddress);
      console.log('Please make sure you have signed up with this wallet address first.');
      return;
    }

    console.log('✅ User found:', {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      walletAddress: user.walletAddress,
      currentRole: user.role
    });

    // Update user to admin
    user.role = 'admin';
    user.isAdmin = true;
    await user.save();

    console.log('🎉 Successfully made user admin!');
    console.log('Updated user details:', {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      walletAddress: user.walletAddress,
      role: user.role,
      isAdmin: user.isAdmin
    });

  } catch (error) {
    console.error('❌ Error making user admin:', error.message);
    if (error.name === 'MongoServerError' && error.code === 8000) {
      console.error('This appears to be an authentication error. Please check your MongoDB connection string.');
    }
  } finally {
    try {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    } catch (disconnectError) {
      console.log('Error disconnecting from MongoDB:', disconnectError.message);
    }
  }
}

// Get wallet address from command line argument
const walletAddress = process.argv[2];

if (!walletAddress) {
  console.log('Usage: node make-admin.js <wallet_address>');
  console.log('Example: node make-admin.js 0x1234567890abcdef...');
  process.exit(1);
}

makeUserAdmin(walletAddress);
