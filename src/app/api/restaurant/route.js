import { connectionStr } from "@/app/lib/db";
import { restaurantSchema } from "@/app/lib/restaurantsModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(params) {
    await mongoose.connect(connectionStr, { useNewUrlParser: true })
    const data = await restaurantSchema.find()
    console.log(data)
    return NextResponse.json({ result: data })
}

export async function POST(request, content) {
    let payload = await request.json();
    console.log(payload)
    await mongoose.connect(connectionStr)
    let restaurant = await restaurantSchema(payload);
    const result = await restaurant.save()
    return NextResponse.json({ result: result, success: true })
}