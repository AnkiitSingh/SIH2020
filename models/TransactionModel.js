var mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    transactionTo: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", TransactionSchema)