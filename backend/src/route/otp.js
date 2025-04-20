const express = require("express");

const wrapAsync = require("../../utils/wrapasyn");
const { sendOtp, verifyOtp } = require("../controller/otp/otp");
const router = express.Router();

router.post("/send-otp", wrapAsync(sendOtp));
router.post("/verify-otp", wrapAsync(verifyOtp));

module.exports = router;
