const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookiePareser = require('cookie-parser');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const { BASEURL } = require('./utils/constanst');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// set securtiy http headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: [
          "'self'",
          'https://cdn.jsdelivr.net',
          'https://cdn.maptiler.com',
        ],

        workerSrc: ["'self'", 'blob:'],

        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://cdn.maptiler.com',
          'https://fonts.googleapis.com',
        ],

        imgSrc: ["'self'", 'data:', 'blob:', 'https://api.maptiler.com'],

        connectSrc: [
          "'self'",
          'https://api.maptiler.com',
          'https://cdn.maptiler.com',
        ],
      },
    },
  }),
);

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
  message: 'Too many request from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// body parser, reading data from body into req.body
app.use(
  express.json({
    limit: '10kb',
  }),
);

app.use(cookiePareser());

// Data sanitization against Nosql query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());
// Prevent paramete pollution
app.use(
  hpp({
    whitelist: ['duration'],
  }),
);

app.use((req, res, next) => {
  next();
});

app.use(`/`, viewRouter);
app.use(`${BASEURL}/tours`, tourRouter);
app.use(`${BASEURL}/users`, userRouter);
app.use(`${BASEURL}/reviews`, reviewRouter);

// This runs if above middle ware wont triggered
app.all('*', (req, res, next) => {
  const err = new AppError(404, `Cant find ${req.originalUrl} on this server`);

  next(err);
});

app.use(globalErrorHandler);
module.exports = app;
