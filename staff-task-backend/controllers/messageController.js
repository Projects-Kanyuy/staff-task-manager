// backend/controllers/messageController.js

const Message = require('../models/Message');

// @desc    Get the last 50 chat messages
// @route   GET /api/messages
exports.getChatHistory = async (req, res) => {
    try {
        // Find the last 50 messages, sort them by creation date (oldest first)
        const messages = await Message.find()
            .sort({ createdAt: -1 })
            .limit(50)
            .sort({ createdAt: 1 }); // Re-sort to show oldest first in the chat window
        
        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};