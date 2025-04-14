const express = require("express");

const { getMessage, addMessage } = require("../controllers/chatController");

const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.get("/messages", authenticate, getMessage);
router.post("/messages", authenticate, addMessage);

module.exports = router;
