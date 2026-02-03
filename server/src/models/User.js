const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: function() {
        // Name required unless phone-only user
        return !this.phoneNumber || this.email;
      },
      trim: true,
    },
    email: {
      type: String,
      required: function() {
        // Email required unless phone-only user
        return !this.phoneNumber;
      },
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      required: function() {
        // Password not required for Google OAuth users or phone users
        return !this.googleId && !this.phoneNumber;
      },
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    googleId: {
      type: String,
      default: null,
      sparse: true,
    },
    plan: {
      type: String,
      enum: ['free', 'pro'],
      default: 'free',
    },
    reputationScore: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    lastManualScanAt: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    phoneOtpHash: {
      type: String,
      default: null,
      select: false,
    },
    phoneOtpExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
