const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModal');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const signup = catchAsync(async (req, res, next) => {
  const { body } = req;
  // hanlde the vaildation in Model
  const newUser = await User.create({
    name: body.name,
    email: body.email,
    password: body.password,
    confirmPassword: body.confirmPassword,
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      newUser,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email.trim() || !password.trim()) {
    return next(new AppError(400, 'Please provide email and password'));
  }
  const user = await User.findOne({ email }).select('+password');
  const isCorrect = user
    ? await user.correctPassword(password, user.password)
    : false;
  if (!user || !isCorrect) {
    return next(new AppError(401, 'Incorrect email or password'));
  }
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
const protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer'))
    return next(new AppError(401, 'Invalid users'));

  const token = authorization.split(' ')[1];
  // console.log();
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const { id: userId, iat } = decoded;

  const currentUser = await User.findById(userId);
  if (!currentUser) {
    return next(
      new AppError(401, 'The user belonging to session is not exits'),
    );
  }
  const isPasswordChangedAfter = currentUser.changedPasswordAfter(iat);
  if (isPasswordChangedAfter) {
    next(new AppError(401, 'Password is changed. Please login again'));
  }

  req.user = currentUser;

  next();
});

const restrictsTo =
  (...roles) =>
  (req, res, next) => {
    const { role } = req.user;
    if (!roles.includes(role)) {
      return next(
        new AppError(403, 'You do not have permission to perform this action'),
      );
    }
    next();
  };

module.exports = {
  signup,
  login,
  protect,
  restrictsTo,
};
