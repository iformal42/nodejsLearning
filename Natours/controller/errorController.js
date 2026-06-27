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
const handleJWTError = () => {
  return new AppError(401, 'Invalid token. Please login again');
};
const handleJWTExpiredError = () => {
  return new AppError(401, 'Token Expired. Please login again');
};
const sendDevErrors = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode || 500).json({
      status: err.status || 'error',
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else {
    console.error('Error 💥: ', err);

    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
};

const sendProdErrors = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err?.isOperational) {
      return res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message,
      });
    }
    // Programming or other unknown error: dont leak error detail
    console.error('Error 💥: ', err);

    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
  if (err?.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  return res.status(500).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later',
  });
};

const globalErrorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') sendDevErrors(err, req, res);
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
    } else if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    } else if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    sendProdErrors(error, req, res);
  }
  next();
};

module.exports = globalErrorHandler;
