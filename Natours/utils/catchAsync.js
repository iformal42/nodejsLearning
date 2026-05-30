const catchAsync = (fn) => (req, res, next) =>
  fn(req, res, next).catch((er) => next(er));

module.exports = catchAsync;
