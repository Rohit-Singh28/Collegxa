const express = require("express");
const wrapAsync = require("../../utils/wrapasyn");
const login = require("../controller/auth/login");
const studentLogin = require("../controller/auth/studentLogin");
const studentSignup = require("../controller/auth/studentSignup");
const router = express.Router();

router.post("/login", wrapAsync(login));
router.post("/student/login", wrapAsync(studentLogin));
router.post("/student/signup", wrapAsync(studentSignup));

module.exports = router;
