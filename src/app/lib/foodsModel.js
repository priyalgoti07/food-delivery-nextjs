const { default: mongoose } = require("mongoose");

const foodsModel = new mongoose.Schema({
    name: String,
    price: String,
    img_path: String,
    descripttion: String
})

export const foodsSchema = mongoose.models.foodsModel || mongoose.model("foods", foodsModel)