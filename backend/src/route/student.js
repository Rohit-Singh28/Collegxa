const express = require("express");
const wrapAsync = require("../../utils/wrapasyn");
const { AuthenticateUser } = require("../../middleware/auth");

const studentInfo = require("../controller/student/info");

const router = express.Router();

router.get("/info", AuthenticateUser, wrapAsync(studentInfo));

module.exports = router;
