const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

const app = express();

const baseUrl = '/api/v1';
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());
app.use(express.static('./public'));

app.use(`${baseUrl}/tours`, tourRouter);
app.use(`${baseUrl}/users`, userRouter);

// This runs if above middle ware wont triggered
app.all('*', (req, res, next) => {
  const err = new AppError(404, `Cant find ${req.originalUrl} on this server`);

  next(err);
});

app.use(globalErrorHandler);
module.exports = app;
