import { connectionStr } from "@/app/lib/db";
import { foodsSchema } from "@/app/lib/foodsModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request) {
    let success = false;
    const payload = await request.json();
    await mongoose.connect(connectionStr, { useNewUrlParser: true })
    if (!payload.name || !payload.price || !payload.img_path || !payload.description) {
        return NextResponse.json({ result: "required file not found", success: false })
    }
    const food = await foodsSchema(payload)
    const result = await food.save()
    console.log("i am post", result)
    if (result) {
        success = true
    }
    return NextResponse.json({ result, success })
}