import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
// import User from '@/models/User';
import { verifyOTP } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { tempUserId, otp } = await request.json();

    // Validate input
    if (!tempUserId || !otp) {
      return NextResponse.json(
        { error: 'Temp user ID and OTP are required' },
        { status: 400 }
      );
    }

    // Dynamic import to avoid build issues
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { default: User } = await import('@/models/User') as any;

    // Find temporary user
    const tempUser = await User.findById(tempUserId);
    if (!tempUser) {
      return NextResponse.json(
        { error: 'Invalid or expired verification session' },
        { status: 400 }
      );
    }

    // Verify OTP
    const isValidOTP = verifyOTP(tempUser.emailOTP, otp, tempUser.emailOTPExpiry);
    if (!isValidOTP) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Mark email as verified
    tempUser.emailVerified = true;
    tempUser.emailOTP = null;
    tempUser.emailOTPExpiry = null;
    await tempUser.save();

    return NextResponse.json({
      message: 'Email verified successfully',
      email: tempUser.email
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
