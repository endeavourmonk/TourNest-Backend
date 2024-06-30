const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const tourRouter = require('./routes/tours');
const userRouter = require('./routes/users');
const reviewRouter = require('./routes/reviews');
const bookingRouter = require('./routes/bookings');
const baseRouter = require('./routes/base');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error');

const app = express();

// securing req headers
app.use(helmet());

// Apply the rate limiting middleware to all requests.
const limiter = rateLimit({
  validate: {
    validationsConfig: false,
    default: true,
  },
  windowMs: process.env.RATE_LIMIT_WINDOW * 60 * 1000,
  limit: process.env.RATE_LIMIT,
  message: 'Rate limit exceeded. Please try again later.',
});

app.use(limiter);

// Middlewares to Parse incoming requests with JSON payloads and URL-encoded data.

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Data sanitization NOSQL Queries
app.use(
  mongoSanitize({
    onSanitize: ({ req, key }) => {
      console.warn(`This request[${key}] is sanitized`);
    },
  }),
);

// Data sanitization XSS

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('tiny'));
}

app.use((req, res, next) => {
  res.requestTime = new Date().toLocaleString();
  next();
});

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/', baseRouter);

app.all('*', (req, res, next) => {
  next(new AppError(404, `${req.originalUrl} not found`));
});

app.use(globalErrorHandler);

// server start
module.exports = app;
