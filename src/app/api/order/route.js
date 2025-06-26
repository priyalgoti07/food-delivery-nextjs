import { connectionStr } from "@/app/lib/db";
import { orderSchema } from "@/app/lib/ordersModel";
import { restaurantSchema } from "@/app/lib/restaurantsModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { use } from "react";

export async function POST(request) {
    const payload = await request.json();
    await mongoose.connect(connectionStr);
    let success = false;
    const orderObj = new orderSchema(payload);

    const result = await orderObj.save();
    if (result) {
        success = true;
    }

    return NextResponse.json({ result, success })

}

export async function GET(request) {
    const queryParams = request.nextUrl.searchParams.get('id');
    console.log("queryParams", queryParams);
    await mongoose.connect(connectionStr);
    let success = false;
    let result = await orderSchema.find({ user_Id: queryParams })
    if (result && result.length > 0) {
        let restoData = await Promise.all(
            result.map(async (item) => {
                let restoInfo = {};
                restoInfo.data = await restaurantSchema.findOne({ _id: item.resto_id });
                restoInfo.amount = item.amount;
                restoInfo.status = item.status;
                return restoInfo;
            })
        )
        result = restoData;
        success = true;
    }
    return NextResponse.json({ result, success })
}