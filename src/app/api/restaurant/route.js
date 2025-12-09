import dbConnect from "@/app/lib/db";
import { restaurantSchema } from "@/app/lib/restaurantsModel";
import { NextResponse } from "next/server";

export async function GET() {
    await dbConnect();
    // OPTIMIZATION: .lean() returns plain JSON, removing Mongoose overhead
    const data = await restaurantSchema.find().lean();
    return NextResponse.json({ result: data });
}

export async function POST(request) {
    const payload = await request.json();
    await dbConnect();

    let result;
    let success = false;
    if (payload.login) {
        // Login Logic
        // SECURITY NOTE: In production, never store passwords as plain text. Use bcrypt.
        result = await restaurantSchema.findOne({
            email: payload.email,
            password: payload.password
        }).lean();

        if (result) {
            success = true;
        }
    } else {
        // Signup Logic
        const restaurant = new restaurantSchema(payload);
        result = await restaurant.save();
        success = true;
    }

    return NextResponse.json({ result, success });
}