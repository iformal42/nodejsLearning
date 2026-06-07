const Review = require('../models/reviewModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getAllReviews = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Review.find(), req.query);
  const reviews = await features.query;
  res.status(200).json({
    status: 'succes',
    results: reviews.length,
    data: { reviews },
  });
});

const getReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError(400, 'Please provide a id '));
  }
  const review = await Review.findById(id);

  res.status(200).json({
    status: 'succes',
    data: { review },
  });
});

const createReview = catchAsync(async (req, res, next) => {
  const { review, rating, userId, tourId } = req.body;
  const body = { review, rating, user: userId, tour: tourId };
  const newReview = await Review.create(body);

  res.status(201).json({
    status: 'succes',
    data: { newReview },
  });
});

module.exports = {
  getAllReviews,
  getReview,
  createReview,
};
