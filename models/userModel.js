const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { type } = require('os');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false,
    },
    role: {
      type: String,
      enum: ['patient', 'admin', 'doctor', 'employee'],
      default: 'patient',
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      validate: {
        validator: function (value) {
          return /^\+20\d{10}$/.test(value);
        },
        message:
          'Phone number must start with +20 and contain 10 digits after it',
      },
    },
    changePasswordAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

userSchema.index({ email: 1 , username: 1}, { unique: true });

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.changePasswordAt = Date.now() - 1000;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if(this.changePasswordAt) {
    const changeTimestamp = parseInt(this.changePasswordAt.getTime() / 1000, 10);
    return JWTTimestamp < changeTimestamp;
  }
  return false;
}

userSchema.methods.createPasswordResetToken = function () {
  // This is the token that will be sent to the user's email
  const resetToken = crypto.randomBytes(32).toString('hex');
  // This is the token that will be stored in the database
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
