const express = require("express");
const wrapAsync = require("../../utils/wrapasyn");
const chatHistory = require("../controller/chat/chatHistory"); // check spelling
const router = express.Router();

router.get("/", wrapAsync(chatHistory));

module.exports = router;
