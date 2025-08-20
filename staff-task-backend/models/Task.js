// models/Task.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assigneeIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  dueDate: { type: Date, required: true },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  startTime: { type: String },
  endTime: { type: String },
}, { timestamps: true }); // timestamps adds createdAt and updatedAt automatically

module.exports = mongoose.model('Task', TaskSchema);