const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/userModal');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const { BASEURL, NODE_ENV } = require('../utils/constanst');
const { log } = require('console');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, data, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKY_EXPIRES_IN * 24 * 60 * 60 * 100,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === NODE_ENV.prod) cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  res.status(201).json({
    status: 'success',
    token,
    data,
  });
};
const signup = catchAsync(async (req, res, next) => {
  const { body } = req;
  // hanlde the vaildation in Model
  const newUser = await User.create({
    name: body.name,
    email: body.email,
    password: body.password,
    confirmPassword: body.confirmPassword,
  });
  return createSendToken(newUser, { newUser }, res);
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
  return createSendToken(user, null, res);
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

const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError(404, 'No user found with given email.'));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}${BASEURL}/reset-password/${resetToken}`;
  const message = `forgot your password? Submit a request with your new password to: ${resetURL}.\nIf you didn't forgot your password, please ignore this email. `;

  try {
    await sendEmail({
      email,
      subject: 'Your reset password token (valid for 10 min)',
      message,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There was an error sending the email. Try again later'),
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email',
  });
  // next();
});

const resetPassword = catchAsync(async (req, res, next) => {
  const { resetToken } = req.params;

  const { password, confirmPassword } = req.body;
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: passwordResetToken,
    passwordResetExpires: { $gte: Date.now() },
  });
  if (!user) {
    return next(new AppError(400, 'Token is invalid or has expired'));
  }
  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();
  return createSendToken(user, null, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { currentPassword, newPassword, passwordConfirm } = req.body;
  const userWithPassword = await User.findById(user._id).select('password');
  if (!userWithPassword) {
    return next(new AppError(404, 'Current user is not exits'));
  }
  const isCorrect = await userWithPassword.correctPassword(
    currentPassword,
    userWithPassword.password,
  );

  if (!isCorrect) {
    return next(new AppError(401, 'Incorrect password'));
  }
  userWithPassword.password = newPassword;
  userWithPassword.confirmPassword = passwordConfirm;
  await userWithPassword.save();
  return createSendToken(userWithPassword, null, res);
});
module.exports = {
  signup,
  login,
  protect,
  restrictsTo,
  forgotPassword,
  resetPassword,
  updatePassword,
};
