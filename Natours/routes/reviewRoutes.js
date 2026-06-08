const express = require('express');
const { protect, restrictsTo } = require('../controller/authController');
const {
  getAllReviews,
  createReview,
  getReview,
  deleteReview,
} = require('../controller/reviewController');
const { roles } = require('../utils/constanst');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, getAllReviews)
  .post(protect, restrictsTo(roles.user), createReview);

router.route('/:id').get(protect, getReview).delete(protect, deleteReview);

module.exports = router;
