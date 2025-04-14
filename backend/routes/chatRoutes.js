const express = require("express");

const { fetchMessage, addMessage } = require("../controllers/chatController");

const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.get("/messages", authenticate, fetchMessage);
router.post("/messages", authenticate, addMessage);

module.exports = router;
