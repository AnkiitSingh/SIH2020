var mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema({
    LoanMediator: {
        type: String,
        required: true
    },
    CandidateName: {
        type: String,
        required: true
    },
    AccountName: {
        type: String,
        required: true
    },
    RequestedAmount: {
        type: Number,
        required: true
    },
    LoanAccount: {
        type: String,
        required: true
    },
    AccountIFSC: {
        type: String,
        required: true
    },
    TransactionId: {
        type: []
    },
    BankPassbook: {
        data: Buffer,
        contentType: String
    },
    AadharPhoto: {
        data: Buffer,
        contentType: String
    },
    IncomeLevel: {
        type: String,
        required: true
    },
    EconomicActivity: {
        type: String,
        required: true
    },
    Age: {
        type: Number,
        required: true
    },
    Saving: {
        type: String,
        required: true
    },
    FamilyStrength: {
        type: Number,
        required: true
    },
    Caste: {
        type: String,
        required: true
    },
    Religion: {
        type: String,
        required: true
    },
    LiteracyLevel: {
        type: String,
        required: true
    },
    phoneNo: {
        type: Number,
        required: true,
    },
    DateofReturn: {
        type: String
    },
    Status: {
        type: String,
        default: "Pending",
        enum: ["Rejected", "Pending", "Approved", "Paid", "Paper Verified", "Request Cancelled"]
    },
    FormReason: {
        type: String,
        default: "In Pending State"
    },
    Repayment: {
        type: String,
        default: "Not Requested",
        enum: ["Rejected", "Pending", "Approved", "Requested", "Not Requested"]
    },
    RepaymentReason: {
        type: String,
        default: ""
    },
    SanctionedAmount: {
        type: Number,
        default: 0
    },
    PaidAmount: {
        type: Number,
        default: 0
    },
    CreditScore: {
        type: String,
        default: 0
    },
    LoanIntrest: {
        type: String,
        default: 0
    },
    InstallmentDetails: {
        type: []
    },
    PayableInstallment: {
        type: Number,
        default: 0
    },
    RepayedAmt: {
        type: Number,
        default: 0
    },
    RepayableId: {
        type: []
    },
    RepayableAmount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("LoanInfo", LoanSchema)