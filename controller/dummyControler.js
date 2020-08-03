const NgoDummy = require("../models/NgoDummy");
const AadhaarDummy = require("../models/aadharDummy");

exports.newNgo = (req, res) => {
    const user = new NgoDummy(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(500).json({
                error: "Please Include All Fields",
            });
        }
        res.json({
            "message": "saved"
        });
    })
}
exports.getDumNgo = async (req, res) => {
    const value = await NgoDummy.find({ NgoId: req.params.id }, async (err, data) => {
        if (err || !data) {
            return res.json({
                message: "No data found"
            })
        }
        return await res.send(data)
    })
}

exports.newAadhar = (req, res) => {
    const user = new AadhaarDummy(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(500).json({
                error: "Please Include All Fields",
            });
        }
        res.json({
            "message": "saved"
        });
    })
}

exports.getDumAadhar = async (req, res) => {
    const value = await AadhaarDummy.find({ AadharNo: req.params.id }, async (err, data) => {
        if (err || !data) {
            return res.json({
                message: "No data found"
            })
        }
        return await res.send(data)
    })
}
