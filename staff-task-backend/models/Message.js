// backend/models/Message.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String, required: true },
    text: { type: String, required: true },
}, { timestamps: true }); // timestamps adds createdAt and updatedAt

module.exports = mongoose.model('Message', MessageSchema);