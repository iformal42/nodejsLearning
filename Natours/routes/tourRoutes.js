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
  getTourWithin,
  getDistnaces,
  resizeTourImages,
  uploadToutImages,
} = require('../controller/tourController');
const { protect, restrictsTo } = require('../controller/authController');
const { roles } = require('../utils/constanst');
const reviewRouter = require('./reviewRoutes');

// router.param('id', checkId);

router.use('/:tourId/reviews', reviewRouter);

router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    protect,
    protect,
    restrictsTo(roles.admin, roles.leadGuide, roles.guid),
    getMonthlyClient,
  );
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.get('/tours-within/:distance/center/:latlng/unit/:unit', getTourWithin);

router.route('/distance/:latlng/unit/:unit').get(getDistnaces);
router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictsTo(roles.admin, roles.leadGuide), createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(
    protect,
    restrictsTo(roles.admin, roles.leadGuide),
    uploadToutImages,
    resizeTourImages,
    updateTour,
  )
  .delete(protect, restrictsTo(roles.admin, roles.leadGuide), deleteTour);

module.exports = router;
