const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    scanTarget: {
      type: String,
      enum: ['email', 'name'],
      required: [true, 'Scan target is required'],
    },
    targetValue: {
      type: String,
      required: [true, 'Target value is required'],
      trim: true,
    },
    findings: {
      breachCount: {
        type: Number,
        default: 0,
      },
      publicMentions: {
        type: Number,
        default: 0,
      },
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Scan = mongoose.model('Scan', scanSchema);

module.exports = Scan;
