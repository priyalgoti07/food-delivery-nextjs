import { connectionStr } from "@/app/lib/db";
import { otpSchema } from "@/app/lib/otpModel";
import { userSchema } from "@/app/lib/usersModel";
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

        await mongoose.connect(connectionStr);

        // 1. Find the active OTP session for this email (Ignore the OTP value for now)
        const otpRecord = await otpSchema.findOne({
            mobile: email,
            expiresAt: { $gt: new Date() }, // Check if not expired
            verified: false,
        });

        // Case A: No active OTP session found (Expired or never requested)
        if (!otpRecord) {
            return NextResponse.json({
                success: false,
                message: 'OTP has expired or does not exist. Please request a new one.'
            });
        }

        // Case B: Session exists, but check max attempts
        if (otpRecord.attempts >= 5) {
            return NextResponse.json({
                success: false,
                message: 'Too many wrong attempts. Please request a new OTP.'
            });
        }

        // Case C: Check if the User entered the WRONG OTP
        if (otpRecord.otp !== otp) {
            // Increment attempt count
            await otpSchema.updateOne(
                { _id: otpRecord._id },
                { $inc: { attempts: 1 } }
            );

            // RETURN THE SPECIFIC ERROR MESSAGE YOU REQUESTED
            return NextResponse.json({
                success: false,
                message: 'Invalid OTP, please enter valid OTP'
            });
        }

        // --- SUCCESS LOGIC (OTP Matches) ---

        // Mark OTP as verified
        await otpSchema.updateOne(
            { _id: otpRecord._id },
            { verified: true }
        );

        // Get user data
        const user = await userSchema.findOne({ email: email });
        console.log("user", user)
        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'User not found'
            }, { status: 404 });
        }

        const phone = user.phone || user.mobile || "";

        return NextResponse.json({
            success: true,
            message: 'OTP verified successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                city: user.city || "",
                address: user.address,
                phone,
            }
        });

    } catch (error) {
        console.error('Email OTP verification error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to verify OTP.',
            error: error.message
        }, { status: 500 });
    }
}