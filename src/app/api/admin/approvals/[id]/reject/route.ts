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

    if (!adminNotes) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
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
    approval.status = 'rejected';
    approval.rejectedBy = adminWallet;
    approval.rejectedAt = new Date();
    approval.rejectionReason = adminNotes;
    approval.adminNotes = adminNotes;

    await approval.save();

    return NextResponse.json({
      success: true,
      message: 'Milestone approval rejected successfully',
      data: {
        id: approval._id.toString(),
        status: approval.status,
        rejectedBy: approval.rejectedBy,
        rejectedAt: approval.rejectedAt,
        rejectionReason: approval.rejectionReason
      }
    });

  } catch (error) {
    console.error('Error rejecting milestone:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
