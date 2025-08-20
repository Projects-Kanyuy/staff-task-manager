// models/Report.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
  staffId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['completed', 'partial', 'not_completed'],
    required: true,
  },
  notes: { type: String },
  screenshotUrl: { type: String }, // Path to the uploaded image
   workLink: { type: String },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Report', ReportSchema);