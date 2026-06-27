const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

const getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All tours ',
    tours,
  });
});
const getTourview = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug }).populate({ path: 'reviews' });
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

module.exports = {
  getOverview,
  getTourview,
  getLogin,
};
