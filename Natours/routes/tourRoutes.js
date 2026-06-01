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
const { protect } = require('../controller/authController');

// router.param('id', checkId);
router.route('/').get(protect, getAllTours).post(protect, createTour);

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyClient);
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
