const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['breach', 'exposure'],
      required: [true, 'Alert type is required'],
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: [true, 'Severity is required'],
    },
    message: {
      type: String,
      required: [true, 'Alert message is required'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
