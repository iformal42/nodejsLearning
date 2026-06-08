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

module.exports = {
  deleteOne,
};
