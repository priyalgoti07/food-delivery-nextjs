const { default: mongoose } = require("mongoose");

const deliverypartnerModel = new mongoose.Schema({
    name: String,
    password: String,
    city: String,
    address: String,
    mobile: String,
})

export const deliverypartnerSchema = mongoose.models.deliverypartners || mongoose.model("deliverypartners", deliverypartnerModel)