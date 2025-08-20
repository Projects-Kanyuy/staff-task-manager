// backend/routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const { getChatHistory } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Any logged-in user can get the chat history
router.get('/', protect, getChatHistory);

module.exports = router;