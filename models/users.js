const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const validator = require('validatorjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A User cannot be without name'],
    trim: true,
    maxLength: [50, 'Name of User cannot exceeds 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'User Account cannot be without an email'],
    unique: true,
    lowercase: true,
    // validate: [validator.isEmail, 'Please enter valid email'],
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
  photo: {
    type: String,
  },
});

userSchema.pre('save', async function (next) {
  // only hash the password only when password is modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePassword = function (password, hash) {
  return bcrypt.compare(password, hash);
};

userSchema.methods.passwordChangedAfterToken = function (tokenIssuedTimestamp) {
  const lastChangedTimestamp = Math.floor(
    new Date(this.passwordLastChanged).getTime() / 1000,
  );
  return lastChangedTimestamp > tokenIssuedTimestamp;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
