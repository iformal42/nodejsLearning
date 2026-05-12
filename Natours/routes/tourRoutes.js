const express = require('express');
const router = express.Router();

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkId,
  validateTour,
} = require('../controller/tourController');

router.param('id', checkId);
router.route('/').get(getAllTours).post(validateTour, createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
