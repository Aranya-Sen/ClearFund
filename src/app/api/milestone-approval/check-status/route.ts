import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MilestoneApproval from '@/models/MilestoneApproval';

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

    // Find the approval request
    const approval = await MilestoneApproval.findOne({
      campaignId,
      milestoneIndex
    });

    if (!approval) {
      return NextResponse.json({
        success: true,
        status: 'none',
        message: 'No approval request found'
      });
    }

    return NextResponse.json({
      success: true,
      status: approval.status,
      data: {
        id: approval._id.toString(),
        status: approval.status,
        createdAt: approval.createdAt,
        approvedAt: approval.approvedAt,
        rejectedAt: approval.rejectedAt,
        autoVerifiedAt: approval.autoVerifiedAt,
        adminNotes: approval.adminNotes
      }
    });

  } catch (error) {
    console.error('Error checking milestone status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
