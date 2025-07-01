const express = require("express");
const verification = require("../controller/counsellor/verification");
const register = require("../controller/counsellor/register");
const documentInfo = require("../controller/counsellor/documentInfo");
const wrapAsync = require("../../utils/wrapasyn");
const { AuthenticateUser } = require("../../middleware/auth");
const homeCounsellor = require("../controller/counsellor/homeCousellor");
const counsellorInfo = require("../controller/counsellor/info");
const isCousellorInDb = require("../controller/counsellor/isCousellorInDb");
const logout = require("../controller/user/logout");
const update = require("../controller/counsellor/update");
const router = express.Router();

router.post("/verify", wrapAsync(verification));
router.get("/verify/:id", wrapAsync(isCousellorInDb));
router.post("/register", wrapAsync(register));
router.post("/documentInfo", wrapAsync(documentInfo));

router.get("/homeCounsellor", wrapAsync(homeCounsellor));
router.get("/info", AuthenticateUser, wrapAsync(counsellorInfo));
router.get("/logout", AuthenticateUser, wrapAsync(logout));

router.put("/update", AuthenticateUser, wrapAsync(update));

module.exports = router;
