const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      next(new AppError(404, 'No document found with the given ID'));
      return;
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: 1,
    });
    if (!doc) {
      next(new AppError(404, 'No document found with the given ID'));
      return;
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

const createOne = (Model) =>
  catchAsync(async (req, res) => {
    const document = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      next(new AppError(404, 'No document found with the given ID'));
      return;
    }
    res.status(200).json({
      status: 'success',
      data: { doc },
    });
  });

const getAll = (Model) =>
  catchAsync(async (req, res) => {
    const { filters } = req;
    let query = Model.find();
    if (filters && Object.entries(filters).length > 0) {
      query = Model.find(filters);
    }

    const features = new APIFeatures(query, req.query);
    features.filter().sort().limitFields().paginate();
    const docs = await features.query;
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        docs,
      },
    });
  });

module.exports = {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
};
