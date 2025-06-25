import { connectionStr } from "@/app/lib/db";
import { restaurantSchema } from "@/app/lib/restaurantsModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(params) {
    await mongoose.connect(connectionStr, { useNewUrlParser: true })
    const data = await restaurantSchema.find()
    return NextResponse.json({ result: data })
}

export async function POST(request, content) {
    let payload = await request.json();
    await mongoose.connect(connectionStr)
    let result;
    let success = false;
    if (payload.login) {
        result = await restaurantSchema.findOne({ email: payload.email, password: payload.password });
        if (result) {
            success = true;
        }
    } else {
        let restaurant = await restaurantSchema(payload);
        result = await restaurant.save()
        success = true;
    }

    return NextResponse.json({ result: result, success })
}