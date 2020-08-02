var mongoose = require("mongoose");

const NgoSchema = new mongoose.Schema(
    {
        NgoId: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        NgoRegNo: {
            type: String,
            required: true,
            unique: true,
        },
        NgoRegCertificate: {
            data: Buffer,
            contentType: String
        },
        AadharPhoto: {
            data: Buffer,
            contentType: String
        },
        formReason: {
            type: String,
            default: "Not Examined"
        },
        NgoHead: {
            type: String,
            required: true
        },
        NgoSector: {
            type: String,
            required: true
        },
        phoneNo: {
            type: Number,
            required: true
        },
        Status: {
            type: String,
            default: "Pending",
            enum: ["Rejected", "Pending", "Approved"]
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        NgoApplication: {
            type: []
        },
        role: {
            type: Number,
            default: 1
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Ngo", NgoSchema)