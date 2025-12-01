import { connectionStr } from "@/app/lib/db";
import { userSchema } from "@/app/lib/usersModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { idToken } = await request.json();

        if (!idToken) {
            return NextResponse.json(
                { success: false, message: "ID token is required" },
                { status: 400 }
            );
        }

        // Verify Google ID token
        const response = await fetch(
            `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`
        );

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: "Invalid Google token" },
                { status: 401 }
            );
        }

        const googleUser = await response.json();

        if (!googleUser.email || !googleUser.email_verified) {
            return NextResponse.json(
                { success: false, message: "Email not verified by Google" },
                { status: 400 }
            );
        }

        await mongoose.connect(connectionStr);

        const normalizedEmail = googleUser.email.toLowerCase().trim();
        let user = await userSchema.findOne({ email: normalizedEmail });
        let isNewUser = false;

        if (user) {
            // Existing user - update auth provider if not set
            const wasUpdated = !user.authProvider || !user.googleId;
            if (!user.authProvider) {
                user.authProvider = "google";
            }
            if (!user.googleId) {
                user.googleId = googleUser.sub;
            }
            if (wasUpdated) {
                await user.save();
            }
            isNewUser = false;
        } else {
            // New user - create account
            isNewUser = true;
            user = new userSchema({
                name: googleUser.name || "User",
                email: normalizedEmail,
                phone: "", // Google doesn't provide phone
                authProvider: "google",
                googleId: googleUser.sub,
            });
            user = await user.save();
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone || "",
                authProvider: user.authProvider || "google",
            },
            isNewUser,
        });
    } catch (error) {
        console.error("Google authentication error:", error);
        return NextResponse.json(
            { success: false, message: "Authentication failed", error: error.message },
            { status: 500 }
        );
    }
}

