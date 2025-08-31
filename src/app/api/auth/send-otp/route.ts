import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
// import User from '@/models/User';
import { generateOTP, sendOTPEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Dynamic import to avoid build issues
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { default: User } = await import('@/models/User') as any;
    
    // Check if user already exists (exclude temporary users with temp wallet addresses)
    const existingUser = await User.findOne({ 
      email: email.toLowerCase(),
      walletAddress: { $not: /^temp_/ }
    });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Clean up any old temporary users for this email
    await User.deleteMany({ 
      email: email.toLowerCase(),
      walletAddress: { $regex: /^temp_/ }
    });

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in a temporary user record with a special flag
    const tempUser = new User({
      email: email.toLowerCase(),
      firstName: 'Temporary',
      lastName: 'User',
      walletAddress: 'temp_' + Date.now(), // Temporary wallet address
      emailOTP: otp,
      emailOTPExpiry: otpExpiry,
      isActive: false, // Not active until verified
      role: 'donor', // Use regular role but identify by wallet address pattern
    });

    await tempUser.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      // Clean up temporary user if email fails
      await User.findByIdAndDelete(tempUser._id);
      return NextResponse.json(
        { error: 'Failed to send OTP email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'OTP sent successfully',
      tempUserId: tempUser._id
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
