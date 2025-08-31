import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Campaign from '@/models/Campaign';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const campaign = await Campaign.findById(id)
      .lean({ virtuals: true });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Fetch creator data
    let creator = {
      firstName: 'Unknown',
      lastName: 'Creator',
      email: 'unknown@example.com',
      profileImage: null
    };
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((campaign as any).creator) {
      try {
        // Dynamic import to avoid build issues
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { default: User } = await import('@/models/User') as any;
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const creatorData = await User.findById((campaign as any).creator)
          .select('firstName lastName email profileImage')
          .lean();
        
        if (creatorData) {
          creator = creatorData;
        }
      } catch (creatorError) {
        console.error('Error fetching creator:', creatorError);
        // Use default creator data if fetch fails
      }
    }

    // Add calculated fields
    const campaignWithCalculations = {
      ...campaign,
      progressPercentage: (campaign as unknown as { goalAmount: number; currentAmount: number }).goalAmount > 0 
        ? Math.min(((campaign as unknown as { goalAmount: number; currentAmount: number }).currentAmount / (campaign as unknown as { goalAmount: number; currentAmount: number }).goalAmount) * 100, 100)
        : 0,
      daysRemaining: (() => {
        const endDate = new Date((campaign as unknown as { endDate: string }).endDate);
        const now = new Date();
        const timeDiff = endDate.getTime() - now.getTime();
        return Math.max(Math.ceil(timeDiff / (1000 * 3600 * 24)), 0);
      })(),
      creator
    };

    return NextResponse.json({ campaign: campaignWithCalculations });

  } catch (error) {
    console.error('Get campaign error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const body = await request.json();
    const { status, currentAmount, donors } = body;

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Update campaign fields
    if (status !== undefined) campaign.status = status;
    if (currentAmount !== undefined) campaign.currentAmount = currentAmount;
    if (donors) {
      campaign.donors = donors;
      campaign.totalDonors = donors.length;
    }

    await campaign.save();

    // Note: populate removed temporarily to fix schema issue

    // Add calculated fields to response
    const campaignWithCalculations = {
      ...campaign.toObject(),
      progressPercentage: (campaign as unknown as { goalAmount: number; currentAmount: number }).goalAmount > 0 
        ? Math.min(((campaign as unknown as { goalAmount: number; currentAmount: number }).currentAmount / (campaign as unknown as { goalAmount: number; currentAmount: number }).goalAmount) * 100, 100)
        : 0,
      daysRemaining: (() => {
        const endDate = new Date((campaign as unknown as { endDate: string }).endDate);
        const now = new Date();
        const timeDiff = endDate.getTime() - now.getTime();
        return Math.max(Math.ceil(timeDiff / (1000 * 3600 * 24)), 0);
      })()
    };

    return NextResponse.json({
      message: 'Campaign updated successfully',
      campaign: campaignWithCalculations
    });

  } catch (error) {
    console.error('Update campaign error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
