import { connectionStr } from "@/app/lib/db";
import { foodsSchema } from "@/app/lib/foodsModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, content) {
    const id = content.params?.id;
    console.log("id", id)
    let success = false;
    await mongoose.connect(connectionStr, { useNewUrlParser: true })
    const result = await foodsSchema.find({ resto_id: id});
    console.log("result",result)
    if (result) {
        success = true;
    } else {

    }
    return NextResponse.json({ result, success })
}