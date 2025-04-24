const express = require("express");
const verification = require("../controller/counsellor/verification");
const register = require("../controller/counsellor/register");
const documentInfo = require("../controller/counsellor/documentInfo");
const wrapAsync = require("../../utils/wrapasyn");
const { AuthenticateUser } = require("../../middleware/auth");
const router = express.Router();

router.post("/verify", wrapAsync(verification));
router.post("/register", wrapAsync(register));
router.post("/documentInfo", wrapAsync(documentInfo));

module.exports = router;
