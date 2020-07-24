const LoanInfo = require("../models/LoanModel");
const formidable = require("formidable");
const fs = require("fs");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

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
            IncomeLevel, EconomicActivity, Age, Saving, FamilyStrength, Caste, Religion, LiteracyLevel,
        } = fields;

        if (!LoanMediator || !RequestedAmount || !CandidateName || !LoanAccount || !AccountIFSC || !AccountName || !IncomeLevel ||
            !EconomicActivity || !Age || !Saving || !FamilyStrength || !Caste || !Religion || !LiteracyLevel) {
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
            res.send("Loan request Registered Successfully")
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

exports.loanDetails = async (req, res) => {
    const value = await LoanInfo.findById({ _id: req.params.id }, async (err, data) => {
        if (err) {
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
        let recieve = req.body.FormRegion;
        if (recieve) {
            data[0].FormRegion = recieve;
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
        loan[0].SanctionedAmount = sanction
        if (sanction) {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;
            loan[0].FormRegion = "Application approved on " + today;
            await loan[0].save()
            return res.json({ message: "Ngo form approved" })
        }
        return res.json({
            message: "Fill the Sanctioned Amount details"
        })
    })
}