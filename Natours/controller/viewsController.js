const Tour = require('../models/tourModel');
const User = require('../models/userModal');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All tours ',
    tours,
  });
});
const getTourview = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug }).populate({ path: 'reviews' });
  if (!tour) {
    return next(new AppError(404, 'There is no tour exist with that name'));
  }
  res.status(200).render('tour', {
    title: slug,
    tour,
  });
});
const getLogin = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'login',
  });
});

const getAccount = catchAsync(async (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
});
const updateUserData = catchAsync(async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name,
      email,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).render('account', {
    title: 'Your account',
    user,
  });
});

module.exports = {
  getOverview,
  getTourview,
  getLogin,
  getAccount,
  updateUserData,
};
