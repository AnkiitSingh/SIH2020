const Repayment = require("../models/RepaymentModel");
const LoanInfo = require("../models/LoanModel");

const twilio = require("twilio");
require("dotenv").config();

var accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken, {
    lazyLoading: true
});
const myNo = +12056193915

exports.newRepayment = (req, res) => {
    const Repay = new Repayment(req.body);
    Repay.LoanId = req.params.id
    Repay.save((err, data) => {
        if (err) {
            return res.status(500).json({
                error: "Please Include All Fields",
            });
        }
        res.json({
            amount: data.amount,
            id: data._id,
            paymentId: data.paymentId,
            LoanId: data.LoanId
        });
    })
}

exports.repayAll = async (req, res) => {
    const value = await Repayment.find({}, (err, data) => {
        if (err) {
            return res.json({
                message: "No record found"
            })
        }
        return res.send(data)
    })
}

exports.filterRepay = async (req, res) => {
    const repay = await Repayment.find({ _id: req.params.id }, function (err, data) {
        if (err) {
            return res.status(404).json({
                error: "data not found",
            });
        }
        return res.send(data[0]);
    })
}

exports.approveRepay = async (req, res) => {
    const repay = await LoanInfo.find({ _id: req.params.id }, async function (err, data) {
        if (err) {
            return res.status(404).json({
                error: "data not found",
            });
        }
        else {
            data[0].RepayedAmt = req.params.amount;
            data[0].RepayableId.push(req.params.tranId);
            await client.messages.create({
                body: "Your repayment request has been approved by MWCD (Govt. of India)",
                to: "+91" + data[0].phoneNo,
                from: myNo
            })
            data[0].save;
            return res.send(data[0])
        }
    })
}

exports.rejectRepay = async (req, res) => {
    const repay = await LoanInfo.find({ _id: req.params.id }, async function (err, data) {
        if (err) {
            return res.status(404).json({
                error: "data not found",
            });
        }
        else {
            await client.messages.create({
                body: "Your repayment request has been rejected MWCD (Govt. of India)",
                to: "+91" + data[0].phoneNo,
                from: myNo
            })
            res.status(200).json({
                error: "",
                success: "Repayment req rejected"
            });
        }
    })
}