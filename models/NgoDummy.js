var mongoose = require("mongoose");

const NgoDummy = new mongoose.Schema({
    RegistrationNo: {
        type: String,
        required: true
    },
    NgoId: {
        type: String,
        required: true
    },
    NgoHead: {
        type: String,
        required: true
    },
    NgoSector: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("NgoDummy", NgoDummy)