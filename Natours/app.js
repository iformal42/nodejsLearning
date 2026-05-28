const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

const baseUrl = '/api/v1';
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());
app.use(express.static('./public'));

app.use(`${baseUrl}/tour`, tourRouter);
app.use(`${baseUrl}/users`, userRouter);

// This runs if above middle ware wont triggered
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'failed',
    message: `Cant find ${req.originalUrl} on this server`,
  });
  next();
});
module.exports = app;
