import dbConnect from "@/app/lib/db";
import { foodsSchema } from "@/app/lib/foodsModel";
import { restaurantSchema } from "@/app/lib/restaurantsModel";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    await dbConnect();

    // If no search, return empty or all (logic adjusted for safety)
    const filter = name ? { name: { $regex: new RegExp(name, 'i') } } : {};

    // OPTIMIZATION: .lean() for speed
    let result = await foodsSchema.find(filter).lean();

    if (result.length === 0) {
        return NextResponse.json({ result: "No food items found", success: false });
    }

    // If searching, we need to find the restaurants associated with these foods
    if (name) {
        // Extract unique restaurant IDs
        const restoIds = [...new Set(result.map((item) => item.resto_id))];

        // Fetch only the restaurants that match these IDs
        const restaurants = await restaurantSchema.find({
            _id: { $in: restoIds },
        }).lean();

        return NextResponse.json({ restaurants, success: true });
    }

    return NextResponse.json({ result, success: true });
}

export async function POST(request) {
    const payload = await request.json();
    await dbConnect();

    // Input Validation
    if (!payload.name || !payload.price || !payload.img_path || !payload.description || !payload.resto_id) {
        return NextResponse.json({ result: "Required fields missing", success: false });
    }

    const food = new foodsSchema(payload);
    const result = await food.save();

    return NextResponse.json({ result, success: true });
}