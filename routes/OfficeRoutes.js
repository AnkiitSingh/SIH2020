const express = require("express");
const router = express.Router();
const { newDepartment, deptLogin, signOut } = require("../controller/OfficeController")

router.post("/ministry/newDepartment", newDepartment);

router.post("/ministryLogin", deptLogin);

router.get("/ministry/signout", signOut);


module.exports = router;