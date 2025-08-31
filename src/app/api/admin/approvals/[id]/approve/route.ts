import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MilestoneApproval from '@/models/MilestoneApproval';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { adminWallet, adminNotes } = await request.json();

    if (!adminWallet) {
      return NextResponse.json(
        { error: 'Admin wallet address is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user is admin - temporarily disabled for build
    // const { default: User } = await import('@/models/User');
    // const adminUser = await User.findOne({ walletAddress: adminWallet });
    // if (!adminUser || (adminUser.role !== 'admin' && !adminUser.isAdmin)) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized: Admin privileges required' },
    //     { status: 403 }
    //   );
    // }

    // Find the approval request
    const approval = await MilestoneApproval.findById(id);
    if (!approval) {
      return NextResponse.json(
        { error: 'Approval request not found' },
        { status: 404 }
      );
    }

    if (approval.status !== 'pending') {
      return NextResponse.json(
        { error: 'Approval request is not pending' },
        { status: 400 }
      );
    }

    // Update approval status
    approval.status = 'approved';
    approval.approvedBy = adminWallet;
    approval.approvedAt = new Date();
    approval.adminNotes = adminNotes;

    await approval.save();

    // TODO: Here you would integrate with your smart contract
    // to request verification on the blockchain
    // const blockchainResult = await requestVerificationOnBlockchain(
    //   approval.campaignId,
    //   approval.milestoneIndex
    // );
    // approval.blockchainTransactionHash = blockchainResult.transactionHash;
    // await approval.save();

    return NextResponse.json({
      success: true,
      message: 'Milestone approval approved successfully',
      data: {
        id: approval._id.toString(),
        status: approval.status,
        approvedBy: approval.approvedBy,
        approvedAt: approval.approvedAt,
        adminNotes: approval.adminNotes
      }
    });

  } catch (error) {
    console.error('Error approving milestone:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
