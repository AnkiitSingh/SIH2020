var mongoose = require("mongoose");

const AadhaarDummy = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Age: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    Dob: {
        type: String,
        required: true
    },
    Sex: {
        type: String,
        required: true
    },
    AadharNo: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("AadhaarDummy", AadhaarDummy)