const express = require("express");
const router = express.Router();

const {
    newNgo, getDumNgo, newAadhar, getDumAadhar
} = require("../controller/dummyControler");

router.post("/dummyNgo", newNgo);

router.get("/getDumNgo/:id", getDumNgo);

router.post("/dummyAadhar", newAadhar);

router.get("/getDumAadhar/:id", getDumAadhar);

module.exports = router;