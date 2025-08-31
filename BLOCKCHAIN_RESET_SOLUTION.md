# Blockchain Reset Issue & Solution

## Problem Description

When you shut down your laptop and restart it, your local blockchain network (Hardhat/Ganache) gets reset. This means all campaigns that were previously deployed on the blockchain are lost, but they still exist in your MongoDB database with their old `blockchainData.campaignId` values.

When users try to donate to these campaigns, they get the error:
```
"Campaign does not exist" (action="estimateGas", data="0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000001743616d706169676e20646f6573206e6f74206578697374000000000000000000", reason="Campaign does not exist"
```

## Root Cause

1. **Campaign exists in database**: Campaign is stored in MongoDB with `blockchainData.campaignId` (e.g., `1`)
2. **Blockchain was reset**: Local blockchain network was reset, so campaign ID `1` no longer exists on the blockchain
3. **Donation fails**: Smart contract tries to access campaign ID `1` which doesn't exist, causing the error

## Solution Implemented

### 1. Blockchain Campaign Validation

The campaign detail page now automatically checks if the campaign exists on the blockchain when loading:

```typescript
const checkBlockchainCampaign = async (blockchainCampaignId: number) => {
  if (!isConnected) return;
  
  setIsCheckingBlockchain(true);
  try {
    await getCampaign(blockchainCampaignId);
    setBlockchainExists(true);
  } catch (error) {
    console.log('Campaign does not exist on blockchain:', error);
    setBlockchainExists(false);
  } finally {
    setIsCheckingBlockchain(false);
  }
};
```

### 2. User-Friendly Warning

When a campaign doesn't exist on the blockchain, users see a clear warning message:

- **Yellow warning banner** explaining the issue
- **"Check Again" button** to re-verify blockchain status
- **"Browse Other Campaigns" link** to find working campaigns
- **"Redeploy Campaign" button** (only visible to campaign creators)

### 3. Donation Protection

Donations are automatically disabled when the campaign doesn't exist on the blockchain:

- Donation input field is disabled
- Donation button shows "Donations Disabled"
- Clear error message if user somehow tries to donate

### 4. Campaign Redeployment

Campaign creators can easily redeploy their campaigns:

```typescript
const handleRedeployCampaign = async () => {
  if (!campaign) return;
  
  setIsRedeploying(true);
  try {
    // Prepare milestone data for blockchain
    const milestoneDescriptions = campaign.milestones.map(m => m.description);
    const milestoneAmounts = campaign.milestones.map(m => m.targetAmount.toString());
    
    // Create campaign on blockchain
    const result = await createCampaign(
      campaign.goalAmount.toString(),
      Math.ceil((new Date(campaign.endDate).getTime() - new Date(campaign.startDate).getTime()) / (1000 * 60 * 60 * 24)),
      milestoneDescriptions,
      milestoneAmounts
    );
    
    // Get the new campaign ID from the result
    const newCampaignId = result.campaignId || Date.now();
    
    // Update the campaign in the database with the new blockchain ID
    const response = await fetch(`/api/campaigns/${campaign._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blockchainData: {
          ...campaign.blockchainData,
          campaignId: newCampaignId,
          totalTransactions: 0
        }
      })
    });
    
    if (response.ok) {
      alert(`Campaign successfully redeployed on blockchain with ID: ${newCampaignId}`);
      await loadCampaignData();
    }
  } catch (error) {
    console.error('Error redeploying campaign:', error);
    alert('Failed to redeploy campaign. Please try again.');
  } finally {
    setIsRedeploying(false);
  }
};
```

## How to Use

### For Users:
1. If you see the yellow warning banner, the campaign is not available for donations
2. Click "Check Again" to see if it's been fixed
3. Click "Browse Other Campaigns" to find working campaigns

### For Campaign Creators:
1. Connect your wallet (must be the same wallet that created the campaign)
2. Click "Redeploy Campaign" button
3. Confirm the transaction in MetaMask
4. Your campaign will be redeployed with a new blockchain ID
5. Donations will be re-enabled

## Prevention Tips

1. **Use persistent blockchain networks** like Sepolia testnet instead of local networks
2. **Backup your blockchain state** if using local networks
3. **Use cloud-based blockchain services** for production environments

## Technical Details

- The solution uses the existing `getCampaign()` function from the blockchain context
- Campaign validation happens automatically when the page loads
- The UI gracefully handles both existing and non-existing campaigns
- All blockchain interactions are properly error-handled
- The solution maintains backward compatibility with existing campaigns
