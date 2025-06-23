import { connectionStr } from "@/app/lib/db";
import { userSchema } from "@/app/lib/usersModel";
import mongoose, { connection, mongo } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
    const payload = await request.json();
    await mongoose.connect(connectionStr);
    let success = false;
    const user = new userSchema(payload);
    const result = await user.save();
    if (result) {
        success = true
    }
    return NextResponse.json({ result, success })
}