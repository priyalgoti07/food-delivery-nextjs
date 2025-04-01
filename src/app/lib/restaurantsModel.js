const { default: mongoose } = require("mongoose");

const restaurantsModel = new mongoose.Schema({
    name: String,
})

export const restaurantSchema = mongoose.models.restaurants || mongoose.model("restaurants", restaurantsModel);