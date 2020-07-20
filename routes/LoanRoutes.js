const express = require("express");
const router = express.Router();
const { LoanForm, updateForm, getPassbook, getAadhar, allLoan, pendingLoan, loanDetails, loanReject, loanApproved } = require("../controller/LoanController");

router.post("/loanForm/form/:ImoId", LoanForm);

router.put("/loanForm/updateForm/:id", updateForm);

router.get("/loanForm/getAadhar/:id", getAadhar);

router.get("/loanForm/getPassbook/:id", getPassbook);

router.get("/loanForm/all", allLoan);

router.get("/loanForm/pending", pendingLoan);

router.get("/loanForm/info/:id", loanDetails);

router.put("/loanForm/reject/:id", loanReject);

router.put("/loanForm/approve/:id", loanApproved);


module.exports = router;