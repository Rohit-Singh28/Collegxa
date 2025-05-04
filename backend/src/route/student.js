const express = require("express");
const wrapAsync = require("../../utils/wrapasyn");
const { AuthenticateUser } = require("../../middleware/auth");

const studentInfo = require("../controller/student/info");
const counsellorDetails = require("../controller/student/cousellorInfo");
const counsellorByClgId = require("../controller/student/counsellorByClgId");
const logout = require("../controller/user/logout");

const router = express.Router();

router.get("/info", AuthenticateUser, wrapAsync(studentInfo));
router.get(
  "/counsellorInfo/:counsellorId",
  AuthenticateUser,
  wrapAsync(counsellorDetails)
);
router.get(
  "/college/:collegeId",
  AuthenticateUser,
  wrapAsync(counsellorByClgId)
);

router.get("/logout", AuthenticateUser, wrapAsync(logout));

module.exports = router;
