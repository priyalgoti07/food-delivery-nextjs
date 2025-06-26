import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectionStr } from "@/app/lib/db";
import { deliverypartnerSchema } from "@/app/lib/deliverypartnersModel";

export async function POST(request) {
    const payload = await request.json();
    await mongoose.connect(connectionStr);
    let success = false;
    const user = new deliverypartnerSchema(payload);
    const result = await user.save();
    if (result) {
        success = true
    }
    return NextResponse.json({ result, success })
}