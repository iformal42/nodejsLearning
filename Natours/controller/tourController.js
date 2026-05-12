const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`));
const validateTour = (req, res, next) => {
  const { name, price } = req.body;
  if (!name || !price)
    return res.status(404).json({
      status: 'fail',
      message: 'name , priceProperty not define',
    });
  next();
};
const checkId = (req, res, next, val) => {
  const id = val;
  const tour = tours.find((el) => el.id == id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'No tour',
    });
  }
  req.tour = tour;
  next();
};

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: req.tour,
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `./dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: newTour,
      });
    },
  );
};

const updateTour = (req, res) => {
  const { body } = req;

  for (const [key, value] of Object.entries(body)) {
    tour[key] = value;
  }
  res.status(200).json({
    status: 'success',
    data: tour,
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
  checkId,
  validateTour,
};
