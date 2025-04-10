import { connectionStr } from "@/app/lib/db";
import { foodsSchema } from "@/app/lib/foodsModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request) {
    let success = false;
    const payload = await request.json();
    await mongoose.connect(connectionStr, { useNewUrlParser: true })
    const food = await foodsSchema(payload)
    const result = await food.save()
    if (result) {
        success = true
    }
    return NextResponse.json({ result, success })
}