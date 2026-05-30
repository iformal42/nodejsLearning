const AppError = require('../utils/appError');

const hanldeCastError = (err) => {
  const mssg = `Invalid ${err.path}: ${err.value}`;
  return new AppError(400, mssg);
};
const handleDuplicateFieldsDB = (err) => {
  const mssg = `${err.keyValue.name} name already exits`;
  return new AppError(400, mssg);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((ms) => ms.message);
  return new AppError(400, errors.join('. '));
};
const sendDevErrors = (err, res) =>
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
    error: err,
    stack: err.stack,
  });

const sendProdErrors = (err, res) => {
  if (err?.isOperational) {
    res.status(err.statusCode || 500).json({
      status: err.status || 'error',
      message: err.message,
    });
  } else {
    // Programming or other unknown error: dont leak error detail
    console.error('Error 💥: ', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') sendDevErrors(err, res);
  else {
    // for production and others, error should be minimal to the client
    let error = Object.create(
      Object.getPrototypeOf(err),
      Object.getOwnPropertyDescriptors(err),
    );
    if (error?.name === 'CastError') {
      error = hanldeCastError(error);
    } else if (error.code === 1100) {
      error = handleDuplicateFieldsDB(error);
    } else if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }

    sendProdErrors(error, res);
  }
  next();
};

module.exports = globalErrorHandler;
