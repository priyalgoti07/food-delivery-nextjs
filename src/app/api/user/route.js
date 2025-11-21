import { connectionStr } from "@/app/lib/db";
import { userSchema } from "@/app/lib/usersModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const isValidEmail = (value = "") => /^\S+@\S+\.\S+$/.test(value);
const isValidPhone = (value = "") => /^\d{10}$/.test(value);

export async function POST(request) {
    try {
        const { name = "", email = "", phone = "" } = await request.json();

        if (!name?.trim() || name.trim().length < 2) {
            return NextResponse.json(
                { success: false, message: "Name must be at least 2 characters" },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();
        if (!isValidEmail(normalizedEmail)) {
            return NextResponse.json(
                { success: false, message: "Please provide a valid email address" },
                { status: 400 }
            );
        }

        const normalizedPhone = phone.replace(/\D/g, "");
        if (!isValidPhone(normalizedPhone)) {
            return NextResponse.json(
                { success: false, message: "Phone number must be 10 digits" },
                { status: 400 }
            );
        }

        await mongoose.connect(connectionStr);

        const existingUser = await userSchema.findOne({ email: normalizedEmail });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "An account with this email already exists" },
                { status: 409 }
            );
        }

        const user = new userSchema({
            name: name.trim(),
            email: normalizedEmail,
            phone: normalizedPhone,
            mobile: normalizedPhone, // backward compatibility
        });

        const result = await user.save();

        return NextResponse.json({
            success: true,
            result: {
                id: result._id,
                name: result.name,
                email: result.email,
                phone: result.phone,
            },
        });
    } catch (error) {
        console.error("User registration failed:", error);
        return NextResponse.json(
            { success: false, message: "Unable to create account", error: error.message },
            { status: 500 }
        );
    }
}