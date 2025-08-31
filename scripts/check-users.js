// Check Users Script
// This script shows all users in the database

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// User Schema (simplified for checking)
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

async function checkUsers() {
  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    console.log('👥 Checking all users...');
    
    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} total users`);

    if (users.length > 0) {
      console.log('\n📋 User Details:');
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. User ID: ${user._id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Wallet: ${user.walletAddress}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Active: ${user.isActive}`);
        console.log(`   Email Verified: ${user.emailVerified}`);
        console.log(`   Created: ${user.createdAt}`);
      });
    } else {
      console.log('✅ No users found in database');
    }

    console.log('\n🎉 Check completed!');
    
  } catch (error) {
    console.error('❌ Error during check:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

// Run the check
checkUsers();
