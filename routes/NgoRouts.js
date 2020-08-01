const express = require("express");
const router = express.Router();
const {
    newNgo, getNgo, getAadhar, getCertificate, getAllNgo, rejectedForm, approveForm,
    updateForm, updateLoginCred, ngoLogin, pendingNgo, blackList
} = require("../controller/NgoController")

router.post("/newNgo", newNgo);

router.get("/getNgo/:id", getNgo);

router.get("/getNgo/aadhar/:id", getAadhar);

router.get("/getNgo/certificate/:id", getCertificate);

router.get("/getNgo/data/all", getAllNgo)

router.get("/getNgo/status/pending", pendingNgo);

router.post("/getNgo/ngoLogin", ngoLogin);

router.put("/getNgo/rejectedStatus/:id", rejectedForm);

router.put("/getNgo/approvedStatus/:id", approveForm);

router.put("/getNgo/blackList/:id", blackList)

router.put("/getNgo/updateForm/:id", updateForm);

router.put("/getNgo/updateLogCred/:id", updateLoginCred);

module.exports = router;