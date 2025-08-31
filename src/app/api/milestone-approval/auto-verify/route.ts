import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MilestoneApproval from '@/models/MilestoneApproval';
import Campaign from '@/models/Campaign';

export async function POST(request: NextRequest) {
  try {
    const { campaignId, milestoneIndex } = await request.json();

    if (!campaignId || milestoneIndex === undefined) {
      return NextResponse.json(
        { error: 'Campaign ID and milestone index are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get the campaign and check if milestone exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    if (!campaign.milestones || milestoneIndex >= campaign.milestones.length) {
      return NextResponse.json(
        { error: 'Milestone not found' },
        { status: 404 }
      );
    }

    const milestone = campaign.milestones[milestoneIndex];
    const currentAmount = campaign.currentAmount || 0;

    // Calculate cumulative target amount for this milestone
    let cumulativeTarget = 0;
    for (let i = 0; i <= milestoneIndex; i++) {
      cumulativeTarget += campaign.milestones[i].targetAmount;
    }

    // Check if the cumulative milestone amount has been reached
    if (currentAmount >= cumulativeTarget) {
      // Find existing approval request or create one
      let approval = await MilestoneApproval.findOne({
        campaignId,
        milestoneIndex,
        status: { $in: ['pending', 'auto_verified'] }
      });

      if (!approval) {
        // Create new auto-verified approval
                 approval = new MilestoneApproval({
           campaignId,
           milestoneIndex,
           creatorWallet: campaign.creatorWalletAddress,
           requestedAmount: cumulativeTarget,
           documents: [],
           status: 'auto_verified',
           autoVerifiedAt: new Date(),
           adminNotes: `Automatically verified - cumulative milestone target amount (${cumulativeTarget} ETH) reached`
         });
             } else {
         // Update existing approval to auto-verified
         approval.status = 'auto_verified';
         approval.autoVerifiedAt = new Date();
         approval.adminNotes = `Automatically verified - cumulative milestone target amount (${cumulativeTarget} ETH) reached`;
       }

      await approval.save();

      return NextResponse.json({
        success: true,
        message: 'Milestone automatically verified',
                 data: {
           id: approval._id.toString(),
           campaignId: approval.campaignId,
           milestoneIndex: approval.milestoneIndex,
           status: approval.status,
           autoVerifiedAt: approval.autoVerifiedAt,
           targetAmount: cumulativeTarget,
           currentAmount,
           milestoneTarget: milestone.targetAmount
         }
      });
    } else {
             return NextResponse.json({
         success: false,
         message: 'Milestone target amount not yet reached',
         data: {
           targetAmount: cumulativeTarget,
           currentAmount,
           remaining: cumulativeTarget - currentAmount,
           milestoneTarget: milestone.targetAmount
         }
       });
    }

  } catch (error) {
    console.error('Error in auto-verification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
