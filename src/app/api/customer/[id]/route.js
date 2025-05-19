import { connectionStr } from "@/app/lib/db"
import { foodsSchema } from "@/app/lib/foodsModel"
import { restaurantSchema } from "@/app/lib/restaurantsModel"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function GET(request, content) {
    console.log("id", content.params.id)
    const id = content.params.id
    await mongoose.connect(connectionStr);
    const details = await restaurantSchema.findOne({ _id: id })
    const foodItms = await foodsSchema.find({ resto_id: id })
    return NextResponse.json({ success: true, details, foodItms })
}