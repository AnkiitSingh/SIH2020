const express = require("express");
const router = express.Router();
const { newDepartment, deptLogin } = require("../controller/OfficeController")

router.post("/ministry/newDepartment", newDepartment);

router.post("/ministryLogin", deptLogin)

module.exports = router;