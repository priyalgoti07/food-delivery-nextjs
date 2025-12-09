import dbConnect from "@/app/lib/db"; // Use the cached connection file I gave you earlier
import { restaurantSchema } from "@/app/lib/restaurantsModel";
import { NextResponse } from "next/server";

export async function GET() {
    await dbConnect();

    // OPTIMIZATION: .distinct() fetches ONLY the unique city names directly from DB.
    // Much faster than fetching all documents and mapping them.
    let cities = await restaurantSchema.distinct("city");

    // Capitalize them (Optional, if data is messy)
    cities = cities.map(city => city.charAt(0).toUpperCase() + city.slice(1));

    return NextResponse.json({ success: true, result: cities });
}