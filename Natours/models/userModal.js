const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
  },
  photo: {
    type: String,
  },
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;
