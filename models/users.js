const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A User cannot be without name'],
    trim: true,
    maxLength: [50, 'Name of User cannot exceeds 50 characters'],
  },
  username: {
    type: String,
    unique: true,
    default: function () {
      // Use the first part of the email as the default username
      return this.email ? this.email.split('@')[0] : undefined;
    },
  },
  email: {
    type: String,
    required: [true, 'User Account cannot be without an email'],
    unique: true,
    validate: {
      validator: function (email) {
        return validator.isEmail(email);
      },
      message: 'Please enter a valid email',
    },
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'guide'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'A User cannot be without name'],
    minLength: [6, 'Password length cannot be less than 6 characters'],
    maxLength: [30, 'Password length cannot exceeds 30 characters'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A User cannot be without name'],
    minLength: [6, 'Password length cannot be less than 6 characters'],
    maxLength: [30, 'Password length cannot exceeds 30 characters'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'passwords does not match',
    },
  },
  passwordLastChanged: {
    type: Date,
    default: Date.now(),
  },
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  photo: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

userSchema.pre('save', async function (next) {
  // only hash the password only when password is modified
  if (!this.isModified('password') && !this.isNew) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  this.passwordLastChanged = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  this.select([
    '-password',
    '-passwordLastChanged',
    '-passwordResetToken',
    '-passwordResetTokenExpires',
  ]);
  next();
});

userSchema.methods.comparePassword = function (password, hash) {
  return bcrypt.compare(password, hash);
};

userSchema.methods.hasPasswordChangedSinceToken = function (
  tokenIssuedTimestamp,
) {
  const lastChangedTimestamp = Math.floor(
    new Date(this.passwordLastChanged).getTime() / 1000,
  );
  return lastChangedTimestamp >= tokenIssuedTimestamp;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
