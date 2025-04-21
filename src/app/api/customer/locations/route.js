import { connectionStr } from "@/app/lib/db";
import { restaurantSchema } from "@/app/lib/restaurantsModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(params) {
    await mongoose.connect(connectionStr, { useNewUrlParser: true });
    let result = await restaurantSchema.find();
    result = result.map((item) => item.city.charAt(0).toUpperCase() + item.city.slice(1))
    const uniqueArray = [...new Set(result)];
    return NextResponse.json({ success: true, result: uniqueArray })
}