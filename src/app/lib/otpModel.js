const { default: mongoose } = require("mongoose");

const otpModel = new mongoose.Schema({

    mobile: {
        type: String,
        required: true,
        index: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: '10m' } // Auto delete after 10 minutes
    },
    attempts: {
        type: Number,
        default: 0
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export const otpSchema = mongoose.models.otps || mongoose.model("otps", otpModel)