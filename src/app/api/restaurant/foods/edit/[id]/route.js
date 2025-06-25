import { connectionStr } from "@/app/lib/db";
import { foodsSchema } from "@/app/lib/foodsModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, content) {
    const id = content.params.id;
    await mongoose.connect(connectionStr, { useNewParse: true });
    const record = { _id: id }
    const result = await foodsSchema.findOne(record)
    return NextResponse.json({ result, success: true })
}

export async function PUT(request, content) {
    const editID = content.params.id;
    const payload = await request.json();
    let success = false;
    await mongoose.connect(connectionStr);
    const result = await foodsSchema.findOneAndUpdate({ _id: editID }, payload);
    if (result) {
        success = true;
    }
    return NextResponse.json({ result, success })
}