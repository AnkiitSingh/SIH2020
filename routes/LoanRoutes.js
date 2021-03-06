const express = require("express");
const router = express.Router();
const { LoanForm, updateForm, getPassbook, loanPaid, loanRejRepay, cancleReq, loanRepay, reqRepay, approvedLoan, getAadhar, allLoan, repaymentLoan, pendingLoan, loanDetails, loanReject, loanApproved, loanImo } = require("../controller/LoanController");

router.post("/loanForm/form/:ImoId", LoanForm);

router.put("/loanForm/updateForm/:id", updateForm);

router.get("/loanForm/getAadhar/:id", getAadhar);

router.get("/loanForm/getPassbook/:id", getPassbook);

router.get("/loanForm/all", allLoan);

router.get("/loanForm/pending", pendingLoan);

router.get("/loanForm/repayment", repaymentLoan);

router.get("/loanForm/approved", approvedLoan)

router.get("/loanForm/info/:id", loanDetails);

router.get("/loanForm/details/:imoId", loanImo)

router.put("/loanForm/reject/:id", loanReject);

router.put("/loanForm/approve/:id", loanApproved);

router.put("/loanForm/paid/:id", loanPaid);

router.put("/loanForm/repayment/:id", loanRepay);

router.put("/loanForm/rejectRepayment/:id", loanRejRepay);

router.put("/loanForm/requestRepay/:id", reqRepay);

router.put("/loanForm/cancle/:id", cancleReq);

module.exports = router;