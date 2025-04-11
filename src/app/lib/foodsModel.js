const { default: mongoose } = require("mongoose");

const foodsModel = new mongoose.Schema({
    name: String,
    price: String,
    img_path: String,
    descripttion: String,
    resto_id:mongoose.Schema.Types.ObjectId
})

export const foodsSchema = mongoose.models.foods || mongoose.model("foods", foodsModel)