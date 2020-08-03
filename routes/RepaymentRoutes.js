const express = require("express");
const router = express.Router();
const {
    newRepayment, repayAll, filterRepay, approveRepay, rejectRepay, repayPending
} = require("../controller/RepaymentController");
const { route } = require("./NgoRouts");

router.post("/newRepayment/:id", newRepayment);

router.get("/getAll/Repayment", repayAll);

router.get("/getPending/Repayment", repayPending);

router.get("/repayment/:id", filterRepay);

router.put("/approveRepayment/:id/:amount/:tranId", approveRepay);

router.get("/rejectRepayment/:id", rejectRepay);

module.exports = router;