const LoanInfo = require("../models/LoanModel");
const Transaction = require("../models/TransactionModel");
const formidable = require("formidable");
const fs = require("fs");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
const twilio = require("twilio");
require("dotenv").config();

var accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken, {
    lazyLoading: true
});
const myNo = +12056193915

exports.LoanForm = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "problem with image",
            });
        }

        const { LoanMediator, RequestedAmount, LoanAccount, AccountIFSC, AccountName, CandidateName,
            IncomeLevel, EconomicActivity, Age, Saving, FamilyStrength, Caste, Religion, LiteracyLevel, phoneNo
        } = fields;

        if (!LoanMediator || !RequestedAmount || !CandidateName || !LoanAccount || !AccountIFSC || !AccountName || !IncomeLevel ||
            !EconomicActivity || !Age || !Saving || !FamilyStrength || !Caste || !Religion || !LiteracyLevel || !phoneNo) {
            return res.status(400).json({
                error: "Please include all fields",
            });
        }

        let newLoan = new LoanInfo(fields);

        //handle file here
        if (file.AadharPhoto) {
            if (file.AadharPhoto.size > 300000) {
                return res.status(400).json({
                    error: "File size too big!",
                });
            }
            newLoan.AadharPhoto.data = fs.readFileSync(file.AadharPhoto.path);
            newLoan.AadharPhoto.contentType = file.AadharPhoto.type;
        }
        if (file.BankPassbook) {
            if (file.BankPassbook.size > 300000) {
                return res.status(400).json({
                    error: "File size too big!",
                });
            }
            newLoan.BankPassbook.data = fs.readFileSync(file.BankPassbook.path);
            newLoan.BankPassbook.contentType = file.BankPassbook.type;
        }
        //save to the DB
        newLoan.save((err, NGO) => {
            if (err) {
                res.status(400).json({
                    error: "Saving product in DB failed",
                });
            }
            client.messages.create({
                body: "Your loan request has been successfully submited to the MWCD (Govt. of India)",
                to: "+91" + NGO.phoneNo,
                from: myNo
            })
            res.status(200).json({
                error: "",
                success: "Loan request Accepted"
            });
        });
    });
}

exports.updateForm = (req, res) => {
    LoanInfo.findById(req.params.id, function (err, data) {
        if (!data) {
            return res.status(404).json({
                error: "NGO not found",
            });
        }
        if (data.Status === "Pending" || data.Status === "Rejected") {
            let form = new formidable.IncomingForm();
            form.keepExtensions = true;
            form.parse(req, (err, fields, file) => {
                if (err) {
                    return res.status(400).json({
                        error: "problem with image",
                    });
                }

                const { LoanMediator, RequestedAmount, LoanAccount, AccountIFSC, AccountName, Name,
                    IncomeLevel, EconomicActivity, Age, Saving, FamilyStrength, Caste, Religion, LiteracyLevel, } = fields;
                data.LoanMediator = LoanMediator;
                data.Name = Name
                data.RequestedAmount = RequestedAmount;
                data.LoanAccount = LoanAccount;
                data.AccountIFSC = AccountIFSC;
                data.AccountName = AccountName;
                data.IncomeLevel = IncomeLevel;
                data.EconomicActivity = EconomicActivity;
                data.Age = Age;
                data.Saving = Saving;
                data.FamilyStrength = FamilyStrength;
                data.Caste = Caste;
                data.Religion = Religion;
                data.LiteracyLevel = LiteracyLevel;
                data.Status = "Pending"
                //handle file here
                if (file.AadharPhoto) {
                    if (file.AadharPhoto.size > 300000) {
                        return res.status(400).json({
                            error: "File size too big!",
                        });
                    }
                    data.AadharPhoto.data = fs.readFileSync(file.AadharPhoto.path);
                    data.AadharPhoto.contentType = file.AadharPhoto.type;
                }
                if (file.NgoRegCertificate) {
                    if (file.NgoRegCertificate.size > 300000) {
                        return res.status(400).json({
                            error: "File size too big!",
                        });
                    }
                    data.NgoRegCertificate.data = fs.readFileSync(file.NgoRegCertificate.path);
                    data.NgoRegCertificate.contentType = file.NgoRegCertificate.type;
                }

                //save to the DB
                data.save((err, Loan) => {
                    if (err) {
                        res.status(400).json({
                            error: "Saving product in DB failed",
                        });
                    }
                    return res.send(data)
                });
            });
        }
        else {
            return res.json({
                message: "Can not update Application because the application is already approved!"
            })
        }
    })
}

exports.getAadhar = async (req, res) => {
    const aadhar = await LoanInfo.find({ _id: req.params.id }, function (err, photo) {
        if (err) {
            return res.status(404).json({
                error: "Aadhar card not found",
            });
        }
        res.set("Content-Type", photo[0].AadharPhoto.contentType);
        return res.send(photo[0].AadharPhoto.data);
    });
}

exports.getPassbook = async (req, res) => {
    const passbook = await LoanInfo.find({ _id: req.params.id }, function (err, photo) {
        if (err) {
            return res.status(404).json({
                error: "Aadhar card not found",
            });
        }
        res.set("Content-Type", photo[0].BankPassbook.contentType);
        return res.send(photo[0].BankPassbook.data);
    });
}

exports.allLoan = async (req, res) => {
    const value = await LoanInfo.find({}, (err, data) => {
        if (err) {
            return res.json({
                message: "No record found"
            })
        }
        for (let i = 0; i < data.length; i++) {
            data[i].BankPassbook = undefined;
            data[i].AadharPhoto = undefined;
        }
        return res.send(data)
    })
}

exports.loanImo = async (req, res) => {
    const loanInfo = await LoanInfo.find({ LoanMediator: req.params.imoId }, function (err, data) {
        if (err) {
            return res.status(404).json({
                error: "Aadhar card not found",
            });
        }
        for (let i = 0; i < data.length; i++) {
            data[i].BankPassbook = undefined;
            data[i].AadharPhoto = undefined;
        }
        return res.send(data);
    })
}

exports.pendingLoan = async (req, res) => {
    const value = await LoanInfo.find({ Status: "Pending" }, async (err, data) => {
        if (err) {
            return res.json({
                message: "No Ngo found"
            })
        }
        for (let i = 0; i < data.length; i++) {
            data[i].BankPassbook = undefined;
            data[i].AadharPhoto = undefined;
        }
        return await res.send(data)
    })
}

exports.repaymentLoan = async (req, res) => {
    const value = await LoanInfo.find({ Repayment: "Requested" }, async (err, data) => {
        if (err) {
            return res.json({
                message: "No Ngo found"
            })
        }
        for (let i = 0; i < data.length; i++) {
            data[i].BankPassbook = undefined;
            data[i].AadharPhoto = undefined;
        }
        return await res.send(data)
    })
}

exports.loanDetails = async (req, res) => {
    const value = await LoanInfo.findById({ _id: req.params.id }, async (err, data) => {
        if (err || !data) {
            return res.json({
                message: "No data found"
            })
        }
        data.BankPassbook = undefined;
        data.AadharPhoto = undefined;
        return await res.send(data)
    })
}

exports.loanReject = async (req, res) => {
    const loanData = await LoanInfo.find({ _id: req.params.id }, async function (err, data) {
        if (err) {
            return res.status(404).json({
                error: " details not found",
            });
        }
        data[0].Status = "Rejected";
        let recieve = req.body.FormReason;
        if (recieve) {
            data[0].FormReason = recieve;
            await data[0].save()
            return res.json({ message: "Loan request Rejected" })
        }
        return res.json({ error: "Please fill complete information" })
    });
}

exports.loanApproved = async (req, res) => {
    const loanDta = await LoanInfo.find({ _id: req.params.id }, async function (err, loan) {
        if (err) {
            return res.status(404).json({
                error: "Details not found",
            });
        }
        loan[0].Status = "Approved";
        var sanction = req.body.SanctionedAmount
        loan[0].SanctionedAmount = sanction;
        loan[0].DateofReturn = req.body.DateofReturn;
        loan[0].CreditScore = req.body.CreditScore;
        loan[0].LoanIntrest = req.body.LoanIntrest;
        loan[0].InstallmentDetails = req.body.InstallmentDetails;
        loan[0].PayableInstallment = req.body.PayableInstallment;
        if (sanction && req.body.DateofReturn && req.body.CreditScore && req.body.LoanIntrest && req.body.InstallmentDetails && req.body.PayableInstallment) {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;
            loan[0].FormReason = "Application approved on " + today;
            await loan[0].save()
            return res.json({ message: "Ngo form approved" })
        }
        return res.json({
            message: "Fill the Sanctioned Amount details"
        })
    })
}

exports.approvedLoan = async (req, res) => {
    const value = await LoanInfo.find({ Status: "Approved" }, async (err, data) => {
        if (err) {
            return res.json({
                message: "No Ngo found"
            })
        }
        for (let i = 0; i < data.length; i++) {
            data[i].BankPassbook = undefined;
            data[i].AadharPhoto = undefined;
        }
        return await res.send(data)
    })
}

exports.loanPaid = async (req, res) => {
    const loanDta = await LoanInfo.find({ _id: req.params.id }, async function (err, loan) {
        if (err) {
            return res.status(404).json({
                error: "Details not found",
            });
        }
        loan[0].Status = "Paid";
        loan[0].Repayment = "Not Requested"
        var paidamt = parseInt(req.body.PaidAmount);
        var TranId = req.body.TranId;
        if (paidamt && TranId) {
            loan[0].PaidAmount = loan[0].PaidAmount + paidamt;
            loan[0].TransactionId.push(TranId);
            var id = loan[0]._id;
            const data = new Transaction();
            data.transactionTo = id;
            data.transactionId = TranId;
            data.amount = paidamt;
            data.save((err, value) => {
                if (err) {
                    return res.status(500).json({
                        error: "Please Include All Fields",
                    });
                }
            })
            await loan[0].save()
            return res.json({ message: "Transaction Process complete" })
        }
        return res.json({
            message: "Fill all the required details"
        })
    })
}

exports.loanRepay = async (req, res) => {
    LoanInfo.find({ _id: req.params.id }, async function (err, loan) {
        if (err) {
            return res.json({ "error": "No data found" })
        }
        else {
            loan[0].Status = "Approved";
            loan[0].RepaymentReason = "Loan Requeted Approved";
            var payableAmt = req.body.payableAmt;
            if (payableAmt) {
                loan[0].PayableInstallment = payableAmt;
                await loan[0].save();
                res.json({ "message": "Laon Repayment req. accepted" });
            }
            res.json({ "error": "fill complete information" })
        }
    })
}

exports.loanRejRepay = async (req, res) => {
    const data = LoanInfo.find({ _id: req.params.id }, async function (err, loan) {
        if (err) {
            return res.json({ "error": "No data found" })
        }
        else {
            loan[0].Repayment = "Rejected";
            loan[0].Status = "Paper Verified"
            var reason = req.body.RepaymentReason;
            if (reason) {
                loan[0].RepaymentReason = reason;
                await loan[0].save();
                res.json({ "message": "Laon Repayment req. rejected" });
            }
            res.json({ "error": "fill complete information" })
        }
    })
}

exports.reqRepay = async (req, res) => {
    LoanInfo.find({ _id: req.params.id }, async function (err, loan) {
        if (err) {
            return res.json({ "error": "No data found" })
        }
        else {
            loan[0].Repayment = "Requested";
            await loan[0].save();
            res.json({ "message": "Laon Repayment req. done" });
        }
    })
}

exports.cancleReq = async (req, res) => {
    LoanInfo.find({ _id: req.params.id }, async function (err, loan) {
        if (err) {
            return res.json({ "error": "No data found" })
        }
        else {
            loan[0].Status = "Request Cancelled";
            await loan[0].save();
            res.json({ "message": "Laon Repayment cancelled" });
        }
    })
}