import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectionStr } from "@/app/lib/db";
import { orderSchema } from "@/app/lib/ordersModel";
import { restaurantSchema } from "@/app/lib/restaurantsModel";

export async function PUT(request) {
    const { id, status } = await request.json();
    await mongoose.connect(connectionStr);
    let success = false;
    let result = await orderSchema.findOneAndUpdate(
        { _id: id },
        { $set: { status: status } },
        { new: true }
    );
    if (result) {
        success = true;
    }
    return NextResponse.json({ result, success })
}

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

export async function GET(request, content) {
    const id = content.params.id;
    await mongoose.connect(connectionStr);
    let success = false;
    let result = await orderSchema.find({ deliveryBoy_id: id })
    if (result && result.length > 0) {
        let restoData = await Promise.all(
            result.map(async (item) => {
                let restoInfo = {};
                restoInfo.data = await restaurantSchema.findOne({ _id: item.resto_id });
                restoInfo._id = item._id, // ✅ Include order _id
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