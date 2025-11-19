import { connectionStr } from "@/app/lib/db";
import { otpSchema } from "@/app/lib/otpModel";
import { userSchema } from "@/app/lib/usersModel"; // Import user model
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json({
                success: false,
                message: 'Email and OTP are required'
            }, { status: 400 });
        }

        if (otp.length !== 6) {
            return NextResponse.json({
                success: false,
                message: 'OTP must be 6 digits'
            });
        }

        await mongoose.connect(connectionStr);

        // Find valid OTP
        const otpRecord = await otpSchema.findOne({
            mobile: email,
            otp: otp,
            expiresAt: { $gt: new Date() },
            verified: false,
            attempts: { $lt: 5 } // Max 5 attempts
        });

        if (!otpRecord) {
            // Increment attempts if OTP exists but is invalid
            await otpSchema.updateOne(
                { mobile: email, expiresAt: { $gt: new Date() } },
                { $inc: { attempts: 1 } }
            );

            return NextResponse.json({
                success: false,
                message: 'Invalid OTP or OTP has expired. Please request a new OTP.'
            });
        }

        // Mark OTP as verified
        await otpSchema.updateOne(
            { _id: otpRecord._id },
            { verified: true }
        );

        // Get user data from database
        const user = await userSchema.findOne({ email: email });
        
        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'User not found'
            }, { status: 404 });
        }

        // Return user data to frontend
        return NextResponse.json({
            success: true,
            message: 'OTP verified successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile
                // Add any other user fields you need
            }
        });

    } catch (error) {
        console.error('Email OTP verification error:', error);

        return NextResponse.json({
            success: false,
            message: 'Failed to verify OTP. Please try again.',
            error: error.message
        }, { status: 500 });
    }
}