const express = require("express");
const router = express.Router();
const { newTransaction, getAllTransaction, filterTransaction, filterReciever } = require("../controller/TransactionController");


router.post("/headOffice/newtransaction/:id", newTransaction)

router.get("/headOffice/allTransaction", getAllTransaction)

router.get("/headOffice/transactionDetail/:id", filterTransaction)

router.get("/headOffice/transactionReciever/:id", filterReciever)

module.exports = router;
