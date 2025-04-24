const express = require("express");
const wrapAsync = require("../../utils/wrapasyn");
const login = require("../controller/auth/login");
const router = express.Router();

router.post("/login", wrapAsync(login));

module.exports = router;
