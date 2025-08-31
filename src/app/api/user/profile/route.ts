import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
// import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Dynamic import to avoid build issues
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { default: User } = await import('@/models/User') as any;
    
    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() }).select('-__v');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role,
        kycCompleted: user.kycCompleted,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
