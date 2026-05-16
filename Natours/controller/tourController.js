const Tour = require('../models/tourModel');

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    // results: tours.length,
    // data: {
    //   tours,
    // },
  });
};

const getTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: req.tour,
  });
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: error,
    });
  }
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    // data: tour,
  });
};
const deleteTour = (req, res) => {
  res.status(204).json({});
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
