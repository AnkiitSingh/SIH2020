const Department = require("../models/OfficeModel");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.newDepartment = (req, res) => {
    const user = new Department(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(500).json({
                error: "Please Include All Fields",
            });
        }
        res.json({
            deptId: user.deptId,
            id: user._id,
            role: user.role
        });
    })
}

exports.deptLogin = (req, res) => {
    const { deptId, password } = req.body;
    Department.findOne({ deptId }, (err, user) => {
        if (err || !user) {
            ;
            return res.status(400).json({
                error: "USER does not exists"
            });
        }
        if (user.password !== password) {
            return res.status(401).json({
                error: "Password Does not match",
            });
        }

        //create token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);
        //put token in cookie
        res.cookie("token", token, { expire: new Date() + 9999 });

        //send response to front end
        const { _id, deptId, role } = user;
        return res.json({ token, user: { _id, deptId, role } });
    });
}

exports.signOut = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "User signout successfully"
    });
};