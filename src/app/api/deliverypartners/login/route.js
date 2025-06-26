import { connectionStr } from "@/app/lib/db";
import { deliverypartnerSchema } from "@/app/lib/deliverypartnersModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request) {
    let success = false;
    const payload = await request.json();
    await mongoose.connect(connectionStr);
    const result = await deliverypartnerSchema.findOne({ mobile: payload.loginMobile, password: payload.loginPassword });
    if (result) {
        success = true
    }
    return NextResponse.json({ result, success })
}