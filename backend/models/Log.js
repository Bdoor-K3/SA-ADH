const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // References User
    action: { type: String, required: true }, // Example: "login", "create_event"
    timestamp: { type: Date, default: Date.now },
    details: { type: String }, // Additional details about the action
    status: { type: String, enum: ['success', 'error'], default: 'success' },
    errorMessage: { type: String }, // Log error message if any
  },
  { timestamps: true }
);

module.exports = mongoose.model('Log', logSchema);
