import { connectionStr } from "@/app/lib/db";
import { deliverypartnerSchema } from "@/app/lib/deliverypartnersModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, content) {
    let { city } = content.params;
    await mongoose.connect(connectionStr);
    let filter = { city: { $regex: new RegExp(city, 'i') } };

    const result = await deliverypartnerSchema.find(filter)
    return NextResponse.json({ result, success: true });
}