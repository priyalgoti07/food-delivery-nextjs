const { default: mongoose } = require("mongoose");

const restaurantsModel = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    city: String,
    address: String,
    contact: String,

})

export const restaurantSchema = mongoose.models.restaurants || mongoose.model("restaurants", restaurantsModel);