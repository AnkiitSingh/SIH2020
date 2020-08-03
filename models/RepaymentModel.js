var mongoose = require("mongoose");

const RepaymentSchema = new mongoose.Schema(
    {
        amount: {
            type: String,
            required: true,
        },
        paymentId: {
            type: String,
            required: true
        },
        LoanId: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: "Pending",
            enum: ["Rejected", "Pending", "Approved"]
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Repayment", RepaymentSchema);
