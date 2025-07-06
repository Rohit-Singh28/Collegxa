const express = require("express");
const wrapAsync = require("../../utils/wrapasyn");
const adminLogin = require("../controller/auth/admin");
const { AuthenticateAdmin } = require("../../middleware/auth");
const counsellorNotVerified = require("../controller/admin/CounsellorNotVerified");
const deleteAdmin = require("../controller/admin/deleteCounsellor");
const verfiyCounsellor = require("../controller/admin/verifyCounsellor");
const router = express.Router();

router.post("/login", wrapAsync(adminLogin));
router.get(
  "/verifyCounsellor",
  AuthenticateAdmin,
  wrapAsync(counsellorNotVerified)
);

router.get(
  "/verifyCounsellor/:counsellorId",
  AuthenticateAdmin,
  wrapAsync(verfiyCounsellor)
);

router.delete(
  "/counsellor/:counsellorId",
  AuthenticateAdmin,
  wrapAsync(deleteAdmin)
);

module.exports = router;
