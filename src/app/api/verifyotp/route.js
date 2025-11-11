import { connectionStr } from "@/app/lib/db";
import { userSchema } from "@/app/lib/usersModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { mobile, otp } = await request.json();

        if (!mobile || !otp) {
            return NextResponse.json({
                success: false,
                message: 'Mobile number and OTP are required'
            }, { status: 400 });
        }

        // Your Twilio OTP verification code here
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;

        const twilio = await import('twilio');
        const client = twilio.default(accountSid, authToken);

        const verificationCheck = await client.verify.v2
            .services(process.env.TWILIO_VERIFY_SERVICE_SID)
            .verificationChecks
            .create({
                to: mobile,
                code: otp
            });

        console.log('OTP verification status:', verificationCheck.status);

        // Remove +91 prefix and connect to database
        const cleanMobile = mobile.replace(/^\+91/, ''); // Remove +91 prefix
        await mongoose.connect(connectionStr);

        // Search for user with clean mobile number (without +91)
        const result = await userSchema.findOne({ mobile: cleanMobile });
        if (verificationCheck.status === 'approved') {
            return NextResponse.json({
                success: true,
                message: 'OTP verified successfully',
                result: result,
            });
        } else {
            return NextResponse.json({
                success: false,
                message: 'Invalid OTP. Please try again.'
            });
        }

    } catch (error) {
        console.error('OTP verification error:', error);

        let errorMessage = 'Failed to verify OTP';

        if (error.code === 60202) {
            errorMessage = 'OTP has expired. Please request a new OTP.';
        } else if (error.code === 20404) {
            errorMessage = 'No OTP request found. Please request a new OTP.';
        }

        return NextResponse.json({
            success: false,
            message: errorMessage,
            error: error.message
        }, { status: 500 });
    }
}