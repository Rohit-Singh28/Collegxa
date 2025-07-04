const express = require("express");
const wrapAsync = require("../../utils/wrapasyn");
const { AuthenticateUser } = require("../../middleware/auth");

const studentInfo = require("../controller/student/info");
const counsellorDetails = require("../controller/student/cousellorInfo");
const counsellorByClgId = require("../controller/student/counsellorByClgId");
const logout = require("../controller/user/logout");
const isCounsellorAllowed = require("../controller/student/IsCounsellorAllowed");
const feedback = require("../controller/student/feedback");

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

// counsellor and course related routes

router.get(
  "/course/:counsellorId",
  AuthenticateUser,
  wrapAsync(isCounsellorAllowed)
);

router.post("/feedback", AuthenticateUser, wrapAsync(feedback));

module.exports = router;
