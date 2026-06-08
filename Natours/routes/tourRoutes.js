const express = require('express');

const router = express.Router();

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyClient,
} = require('../controller/tourController');
const { protect, restrictsTo } = require('../controller/authController');
const { roles } = require('../utils/constanst');
const reviewRouter = require('./reviewRoutes');

// router.param('id', checkId);

router.use('/:tourId/reviews', reviewRouter);
router.route('/').get(protect, getAllTours).post(protect, createTour);

router.route('/tour-stats').get(protect, getTourStats);
router.route('/monthly-plan/:year').get(protect, getMonthlyClient);
router.route('/top-5-cheap').get(protect, aliasTopTours, getAllTours);

router
  .route('/:id')
  .get(protect, getTour)
  .patch(protect, updateTour)
  .delete(protect, restrictsTo(roles.admin, roles.leadGuide), deleteTour);

module.exports = router;
