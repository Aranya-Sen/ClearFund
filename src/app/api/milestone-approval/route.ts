import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MilestoneApproval from '@/models/MilestoneApproval';
import Campaign from '@/models/Campaign';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { campaignId, milestoneIndex, creatorWallet, requestedAmount, documents } = await request.json();

    if (!campaignId || milestoneIndex === undefined || !creatorWallet || !requestedAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verify campaign exists and belongs to creator
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    if (campaign.creatorWalletAddress.toLowerCase() !== creatorWallet.toLowerCase()) {
      return NextResponse.json(
        { error: 'Unauthorized: Campaign does not belong to this wallet' },
        { status: 403 }
      );
    }

    // Check if milestone exists
    if (!campaign.milestones || milestoneIndex >= campaign.milestones.length) {
      return NextResponse.json(
        { error: 'Milestone not found' },
        { status: 404 }
      );
    }

    // Validate milestone amount matches cumulative target amount
    let cumulativeTarget = 0;
    for (let i = 0; i <= milestoneIndex; i++) {
      cumulativeTarget += campaign.milestones[i].targetAmount;
    }
    
    if (cumulativeTarget !== requestedAmount) {
      return NextResponse.json(
        { error: `Requested amount does not match cumulative milestone target amount. Expected: ${cumulativeTarget}, Got: ${requestedAmount}` },
        { status: 400 }
      );
    }

    // Check if approval already exists for this milestone
    const existingApproval = await MilestoneApproval.findOne({
      campaignId,
      milestoneIndex,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingApproval) {
      return NextResponse.json(
        { error: 'Approval request already exists for this milestone' },
        { status: 400 }
      );
    }

    // Create new approval request
    const approval = new MilestoneApproval({
      campaignId,
      milestoneIndex,
      creatorWallet: creatorWallet.toLowerCase(),
      requestedAmount,
      documents: documents || [],
      status: 'pending'
    });

    await approval.save();

    return NextResponse.json({
      success: true,
      message: 'Milestone approval request submitted successfully',
      approval: {
        id: approval._id.toString(),
        campaignId: approval.campaignId,
        milestoneIndex: approval.milestoneIndex,
        status: approval.status,
        createdAt: approval.createdAt
      }
    });

  } catch (error) {
    console.error('Error submitting milestone approval:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
