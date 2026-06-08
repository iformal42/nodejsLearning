const express = require('express');
const { protect, restrictsTo } = require('../controller/authController');
const {
  getAllReviews,
  createReview,
  getReview,
  deleteReview,
  updateReview,
  setTourUserIds,
  setFilterToGetAll,
} = require('../controller/reviewController');
const { roles } = require('../utils/constanst');

const router = express.Router({ mergeParams: true });
router.use(protect);
router
  .route('/')
  .get(setFilterToGetAll, getAllReviews)
  .post(restrictsTo(roles.user), setTourUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictsTo(roles.admin, roles.user), updateReview)
  .delete(restrictsTo(roles.admin, roles.user), deleteReview);

module.exports = router;
