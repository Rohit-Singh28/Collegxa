const express = require("express");
const router = express.Router();
const wrapAsync = require("../../utils/wrapasyn");
const { AuthenticateUser } = require("../../middleware/auth");
const checkoutController = require("../controller/payment/checkout");
const verifyController = require("../controller/payment/verify");

router.post("/", AuthenticateUser, wrapAsync(checkoutController));
router.post("/verify", AuthenticateUser, wrapAsync(verifyController));

module.exports = router;
