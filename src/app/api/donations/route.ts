import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
// Import User model first to ensure it's registered
import User from '@/models/User';
import Campaign from '@/models/Campaign';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const donor = searchParams.get('donor');

    if (!donor) {
      return NextResponse.json(
        { error: 'Donor wallet address is required' },
        { status: 400 }
      );
    }

    // Find all campaigns that have donations from this donor
    const campaigns = await Campaign.find({
      'donors.walletAddress': donor.toLowerCase()
    });

    // Extract donation data from campaigns
    const donations = [];
    
    for (const campaign of campaigns) {
      const campaignDonations = campaign.donors.filter(
        (donorData: { walletAddress: string }) => donorData.walletAddress.toLowerCase() === donor.toLowerCase()
      );
      
      for (const donation of campaignDonations) {
        donations.push({
          campaignId: campaign._id,
          campaignTitle: campaign.title,
          amount: donation.amount,
          currency: campaign.currency,
          donatedAt: donation.donatedAt,
          transactionHash: donation.transactionHash
        });
      }
    }

    // Sort by donation date (newest first)
    donations.sort((a, b) => new Date(b.donatedAt).getTime() - new Date(a.donatedAt).getTime());

    return NextResponse.json({
      donations,
      total: donations.length
    });

  } catch (error) {
    console.error('Get donations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
