const { default: mongoose } = require("mongoose");

const userModel = new mongoose.Schema(
    {
        name: String,
        email: String,
        phone: String,
        password: String,
        city: String,
        address: String,
        mobile: String,
        authProvider: {
            type: String,
            enum: ["email", "google"],
            default: "email",
        },
        googleId: String,
    },
    { timestamps: true }
);

export const userSchema = mongoose.models.users || mongoose.model("users", userModel)
