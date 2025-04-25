const express = require("express");
const wrapAsync = require("../../utils/wrapasyn");
const suggestCollege = require("../controller/college/suggestCollege");
const router = express.Router();

router.get("/", wrapAsync(suggestCollege));

module.exports = router;
