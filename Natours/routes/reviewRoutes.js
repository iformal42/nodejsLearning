const express = require('express');
const { protect, restrictsTo } = require('../controller/authController');
const {
  getAllReviews,
  createReview,
  getReview,
} = require('../controller/reviewController');
const { roles } = require('../utils/constanst');

const router = express.Router();

router
  .route('/')
  .get(protect, getAllReviews)
  .post(protect, restrictsTo(roles.user), createReview);
router.route('/:id').get(protect, getReview);

module.exports = router;
