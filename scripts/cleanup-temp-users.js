// Cleanup Temporary Users Script
// This script removes all temporary users from the database

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// User Schema (simplified for cleanup)
const userSchema = new mongoose.Schema({
  email: String,
  role: String,
  isActive: Boolean,
  createdAt: Date
});

let User;
if (mongoose.models.User) {
  User = mongoose.models.User;
} else {
  User = mongoose.model('User', userSchema);
}

async function cleanupTempUsers() {
  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    console.log('🧹 Cleaning up temporary users...');
    
    // Find all temporary users
    const tempUsers = await User.find({ role: 'temp' });
    console.log(`Found ${tempUsers.length} temporary users`);

    if (tempUsers.length > 0) {
      // Delete all temporary users
      const result = await User.deleteMany({ role: 'temp' });
      console.log(`✅ Deleted ${result.deletedCount} temporary users`);
    } else {
      console.log('✅ No temporary users found');
    }

    console.log('🎉 Cleanup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

// Run the cleanup
cleanupTempUsers();
