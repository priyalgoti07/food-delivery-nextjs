import { connectionStr } from "@/app/lib/db";
import { otpSchema } from "@/app/lib/otpModel";
import { userSchema } from "@/app/lib/usersModel"; // Import your user model
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({
                success: false,
                message: 'Email address is required'
            }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({
                success: false,
                message: 'Please enter a valid email address'
            }, { status: 400 });
        }

        await mongoose.connect(connectionStr);

        // Check if email exists in userModel
        const existingUser = await userSchema.findOne({
            email: email.toLowerCase().trim()
        });

        // Send OTP ONLY if email exists in user model
        if (!existingUser) {
            return NextResponse.json({
                success: false,
                message: 'No account found with this email. Please sign up first.'
            }, { status: 404 });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Delete any existing OTPs for this email
        await otpSchema.deleteMany({
            mobile: email,
            verified: false
        });

        // Store OTP in database
        await otpSchema.create({
            mobile: email, // Using email as identifier
            otp: otp,
            expiresAt: expiresAt
        });

        // Send OTP via email
        const emailResult = await sendEmailOTP(email, otp);

        if (emailResult.success) {
            return NextResponse.json({
                success: true,
                message: 'OTP sent successfully to your registered email',
                debug_otp: process.env.NODE_ENV === 'development' ? otp : undefined
            });
        } else {
            throw new Error(emailResult.error);
        }

    } catch (error) {
        console.error('Email OTP error:', error);

        let errorMessage = 'Failed to send OTP. Please try again.';

        // Handle specific email errors
        if (error.message.includes('Invalid login')) {
            errorMessage = 'Email configuration error. Please contact support.';
        } else if (error.message.includes('recipients')) {
            errorMessage = 'Invalid email address. Please check your email.';
        }

        return NextResponse.json({
            success: false,
            message: errorMessage,
            error: error.message
        }, { status: 500 });
    }
}

// Function to send email using Nodemailer
async function sendEmailOTP(email, otp) {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
            },
        });

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #333; margin-bottom: 10px;">OTP Verification</h2>
                        <p style="color: #666; margin: 0;">Use this code to login to your account</p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                        <h1 style="margin: 0; color: white; font-size: 42px; letter-spacing: 8px; font-weight: bold;">${otp}</h1>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0; color: #666; font-size: 14px;">
                            <strong>Note:</strong> This OTP is valid for <strong>10 minutes</strong>. 
                            Do not share this code with anyone.
                        </p>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">
                    
                    <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
                        If you didn't request this OTP, please ignore this email.<br>
                        This is an automated message, please do not reply.
                    </p>
                </div>
            `,
            text: `Your OTP verification code is: ${otp}\n\nThis OTP is valid for 10 minutes. Do not share this code with anyone.\n\nIf you didn't request this OTP, please ignore this email.`
        };

        // Send email
        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', email, 'Message ID:', result.messageId);

        return { success: true, messageId: result.messageId };

    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, error: error.message };
    }
}