// Cleanup Incomplete Users Script
// This script removes users with temp wallet addresses

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// User Schema (simplified for cleanup)
const userSchema = new mongoose.Schema({
  email: String,
  walletAddress: String,
  role: String,
  isActive: Boolean,
  emailVerified: Boolean,
  createdAt: Date
});

let User;
if (mongoose.models.User) {
  User = mongoose.models.User;
} else {
  User = mongoose.model('User', userSchema);
}

async function cleanupIncompleteUsers() {
  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    console.log('🧹 Cleaning up incomplete users...');
    
    // Find users with temp wallet addresses
    const incompleteUsers = await User.find({ 
      walletAddress: { $regex: /^temp_/ }
    });
    console.log(`Found ${incompleteUsers.length} incomplete users`);

    if (incompleteUsers.length > 0) {
      console.log('\n📋 Incomplete Users to be deleted:');
      incompleteUsers.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}, Wallet: ${user.walletAddress}`);
      });

      // Delete incomplete users
      const result = await User.deleteMany({ 
        walletAddress: { $regex: /^temp_/ }
      });
      console.log(`\n✅ Deleted ${result.deletedCount} incomplete users`);
    } else {
      console.log('✅ No incomplete users found');
    }

    console.log('\n🎉 Cleanup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

// Run the cleanup
cleanupIncompleteUsers();
