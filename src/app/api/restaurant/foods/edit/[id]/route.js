import { connectionStr } from "@/app/lib/db";
import { foodsSchema } from "@/app/lib/foodsModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, content) {
    const id = content.params.id;
    console.log("_id=============>", id)
    await mongoose.connect(connectionStr, { useNewParse: true });
    const record = { _id: id }
    const result = await foodsSchema.findOne(record)
    return NextResponse.json({ result, success: true })
}