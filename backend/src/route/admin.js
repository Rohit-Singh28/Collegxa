const express = require("express");
const wrapAsync = require("../../utils/wrapasyn");
const adminLogin = require("../controller/auth/admin");
const { AuthenticateAdmin } = require("../../middleware/auth");
const counsellorNotVerified = require("../controller/admin/CounsellorNotVerified");
const router = express.Router();

router.post("/login", wrapAsync(adminLogin));
router.get(
  "/verifyCounsellor",
  AuthenticateAdmin,
  wrapAsync(counsellorNotVerified)
);

module.exports = router;
