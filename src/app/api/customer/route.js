// import { connectionStr } from "@/app/lib/db";
// import { restaurantSchema } from "@/app/lib/restaurantsModel";
// import mongoose from "mongoose";
// import { NextResponse } from "next/server";

// export async function GET(request) {
//     const queryParams = request.nextUrl.searchParams;
//     let filter = {};
//     if (queryParams.get("location")) {
//         let city = queryParams.get("location");
//         filter = { city: { $regex: new RegExp(city, 'i') } }
//     } else if (queryParams.get("restaurant")) {
//         let name = queryParams.get("restaurant");
//         filter = { name: { $regex: new RegExp(name, 'i') } }
//     }
//     await mongoose.connect(connectionStr);
//     let result = await restaurantSchema.find(filter)
//     return NextResponse.json({ result, success: true })
// }


import dbConnect from "@/app/lib/db"; // Use the cached connection
import { restaurantSchema } from "@/app/lib/restaurantsModel";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await dbConnect(); // Connects only if not already connected

        const { searchParams } = request.nextUrl;
        const location = searchParams.get("location");
        const restaurant = searchParams.get("restaurant");

        let filter = {};

        // Optimize: Only use Regex if strictly necessary. 
        // If searching by ID or exact match, don't use regex.
        if (location) {
            // 'i' makes it case insensitive (slower but user friendly)
            filter.city = { $regex: new RegExp(location, 'i') };
        } else if (restaurant) {
            filter.name = { $regex: new RegExp(restaurant, 'i') };
        }

        // OPTIMIZATION 1: .select()
        // Only fetch fields you actually need on the frontend (e.g., name, image, city)
        // avoiding heavy fields like 'description' or 'reviews' if not needed.
        // Example: .select("name city image address")

        // OPTIMIZATION 2: .lean()
        // Returns plain JSON instead of heavy Mongoose Documents. Huge speed boost.
        const result = await restaurantSchema.find(filter).lean();

        return NextResponse.json({ result, success: true });
    } catch (error) {
        return NextResponse.json({ result: [], success: false, error: error.message }, { status: 500 });
    }
}