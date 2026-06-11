const Review = require('../models/reviewModel');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handleFactory');

const setFilterToGetAll = (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  req.filters = filter;
  next();
};
const getAllReviews = getAll(Review);

const getReview = getOne(Review);

const setTourUserIds = (req, res, next) => {
  if (!req.body.tourId) req.body.tourId = req.params.tourId;
  if (!req.body.userId) req.body.userId = req.user.id;
  const { review, rating, userId, tourId } = req.body;

  const body = { review, rating, user: userId, tour: tourId };
  req.body = body;
  next();
};

const createReview = createOne(Review);
const deleteReview = deleteOne(Review);
const updateReview = updateOne(Review);

module.exports = {
  getAllReviews,
  getReview,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
  setFilterToGetAll,
};
