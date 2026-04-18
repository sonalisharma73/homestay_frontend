const express = require("express");
const router = express.Router();

const { chatbotReply } = require("../controllers/chatbotController");
const { hostChatbotReply } = require("../controllers/hostChatbotController");

router.post("/chatbot", chatbotReply);

router.post("/host-chatbot", hostChatbotReply);

module.exports = router;