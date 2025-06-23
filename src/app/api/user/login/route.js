import { connectionStr } from "@/app/lib/db";
import { userSchema } from "@/app/lib/usersModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request) {
    const payload = await request.json();
    await mongoose.connect(connectionStr);
    let success = false;
    const result = await userSchema.findOne({ email: payload.email, password: payload.password });
    if (result) {
        success = true;
    }
    return NextResponse.json({ result, success })
}