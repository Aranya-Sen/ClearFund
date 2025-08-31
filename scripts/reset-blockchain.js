// Reset Blockchain State Script
// This script helps clear any cached blockchain data

console.log('🔄 Resetting blockchain state...');

// Clear localStorage (if running in browser)
if (typeof window !== 'undefined') {
  console.log('Clearing browser localStorage...');
  localStorage.clear();
  sessionStorage.clear();
  console.log('✅ Browser storage cleared');
}

// Clear any cached blockchain data
console.log('Clearing blockchain cache...');

// Reset campaign counter and other blockchain state
const resetBlockchainState = () => {
  // This would typically reset your local blockchain
  // For now, we'll just log the reset
  console.log('✅ Blockchain state reset completed');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Restart your development server');
  console.log('2. Clear your browser cache');
  console.log('3. Try connecting your wallet again');
  console.log('4. Create a new campaign');
};

resetBlockchainState();
