const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

const getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();
  console.log(tours);
  res.status(200).render('overview', {
    title: 'All tours ',
    tours,
  });
});
const getTourview = catchAsync(async (req, res) => {
  const { slug } = req.params;

  const tour = await Tour.findOne({ slug }).populate({ path: 'reviews' });
  console.log(tour);
  res.status(200).render('tour', {
    title: slug,
    tour,
  });
  // res.status(200).json({
  //   title: slug,
  //   tour,
  // });
});

module.exports = {
  getOverview,
  getTourview,
};
