const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { roles } = require('../utils/constanst');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [40, 'A name must have max 40 chars'],
    minlength: [3, 'A name must have min 10 chars'],
    // validate: [validator.isAlpha, 'Name should only contain character'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Email is not in correct format'],
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    trim: true,
    maxlength: [15, 'A password name must have max 15 chars'],
    minlength: [8, 'A password name must have min 8 chars'],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'A password required'],
    trim: true,
    maxlength: [15, 'A password name must have max 15 chars'],
    minlength: [8, 'A password name must have min 8 chars'],
    validate: {
      // This only works on SAVE!
      validator: function (pwd) {
        return this.password === pwd;
      },
      message: 'Password should match with confirm password',
    },
    select: false,
  },
  role: {
    type: String,
    enum: [roles.user, roles.guid, roles.leadGuide, roles.admin],
    default: roles.user,
  },
  photo: {
    type: String,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangeAt: { type: Date },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  __v: {
    type: Number,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangeAt = Date.now() - 2000;

  next();
});

userSchema.methods.correctPassword = async function (candidatePwd, userPwd) {
  return await bcrypt.compare(candidatePwd, userPwd);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changedTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10,
    );

    return changedTimestamp > JWTTimestamp;
  }
  return false;
};

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.post('save', function (user, next) {
  user.password = undefined;
  user.__v = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
