import { connectionStr } from "@/app/lib/db";
import { foodsSchema } from "@/app/lib/foodsModel";
import { restaurantSchema } from "@/app/lib/restaurantsModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, content) {
    const { searchParams } = new URL(request.url);

    const name = searchParams.get("name");

    await mongoose.connect(connectionStr);
    const filter = name ? { name: { $regex: new RegExp(name, 'i') } } : {};
    let foodItems = await foodsSchema.find(filter);

    if (foodItems.length === 0) {
        return NextResponse.json({ foodItems: "No food items found", success: false });
    }
    // Step 2: Extract unique resto_ids from food items
    if (name) {
        const restoIds = [
            ...new Set(foodItems.map((item) => item.resto_id.toString())),
        ];

        // Step 3: Fetch restaurants for those IDs
        const restaurants = await restaurantSchema.find({
            _id: { $in: restoIds },
        });
        return NextResponse.json({ restaurants, success: true })
    }
    return NextResponse.json({ foodItems, success: true })
}

export async function POST(request) {
    let success = false;
    const payload = await request.json();
    await mongoose.connect(connectionStr, { useNewUrlParser: true })
    if (!payload.name || !payload.price || !payload.img_path || !payload.description) {
        return NextResponse.json({ result: "required file not found", success: false })
    }
    const food = await foodsSchema(payload)
    const result = await food.save()
    if (result) {
        success = true
    }
    return NextResponse.json({ result, success })
}