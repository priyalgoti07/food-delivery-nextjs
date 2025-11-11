import { NextResponse } from "next/server";

// Function to format phone number to E.164 format
function formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // If number doesn't start with +, add India country code
    if (!cleaned.startsWith('+')) {
        // Remove leading 0 if present
        if (cleaned.startsWith('0')) {
            cleaned = cleaned.substring(1);
        }
        // Add India country code if no country code present
        if (!cleaned.startsWith('91') && cleaned.length === 10) {
            cleaned = `91${cleaned}`;
        }
        // Add + prefix for E.164 format
        cleaned = `+${cleaned}`;
    }
    
    return cleaned;
}

export async function POST(request) {
    try {
        const { mobile, channel = 'sms' } = await request.json();

        if (!mobile) {
            return NextResponse.json({
                success: false,
                message: 'Mobile number is required'
            }, { status: 400 });
        }

        // Format the phone number to E.164 format
        const formattedMobile = formatPhoneNumber(mobile);
        console.log('Formatted mobile:', formattedMobile);

        // Your Twilio OTP sending code here
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        
        // Use dynamic import for Twilio (better for Next.js)
        const twilio = await import('twilio');
        const client = twilio.default(accountSid, authToken);

        const verification = await client.verify.v2
            .services(process.env.TWILIO_VERIFY_SERVICE_SID)
            .verifications
            .create({ 
                to: formattedMobile, 
                channel: channel 
            });

        console.log('OTP sent successfully:', verification.sid);

        return NextResponse.json({
            success: true,
            message: 'OTP sent successfully to your mobile',
            sid: verification.sid
        });

    } catch (error) {
        console.error('OTP sending error:', error);
        
        let errorMessage = 'Failed to send OTP';
        
        // Handle specific Twilio errors
        if (error.code === 60200) {
            errorMessage = 'Invalid phone number format. Please check your number.';
        } else if (error.code === 21211) {
            errorMessage = 'Invalid phone number. Please enter a valid number.';
        } else if (error.code === 21408) {
            errorMessage = 'This number needs to be verified in your Twilio account first.';
        }

        return NextResponse.json({
            success: false,
            message: errorMessage,
            error: error.message
        }, { status: 500 });
    }
}