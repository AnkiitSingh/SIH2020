const LoanInfo = require("../models/LoanModel");
const Transaction = require("../models/TransactionModel");

exports.newTransaction = async (req, res) => {
    const id = req.params.id
    const loanData = LoanInfo.find({ _id: id }, (err, info) => {
        if (err) {
            res.Json({ message: "User not found" })
        }
        const data = new Transaction(req.body);
        data.transactionTo = id;
        data.save((err, value) => {
            if (err) {
                return res.status(500).json({
                    error: "Please Include All Fields",
                });
            }
            info[0].TransactionId.push(value._id);
            info[0].save();
            return res.json({
                amount: value.amount,
                id: value._id,
                transactionId: value.transactionId,
                loanId: id
            });
        })
    })

}

exports.getAllTransaction = async (req, res) => {
    const value = await Transaction.find({}, (err, data) => {
        if (err) {
            return res.json({
                message: "No record found"
            })
        }
        return res.send(data)
    })
}

exports.filterTransaction = async (req, res) => {
    const value = await Transaction.find({ _id: req.params.id }, (err, data) => {
        if (err) {
            return res.json({
                message: "No record found"
            })
        }
        return res.send(data)
    })
}

exports.filterReciever = async (req, res) => {
    const value = await Transaction.find({ transactionTo: req.params.id }, (err, data) => {
        if (err) {
            return res.json({
                message: "No record found"
            })
        }
        return res.send(data)
    })
}