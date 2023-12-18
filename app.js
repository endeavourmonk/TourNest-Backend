const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const tourRouter = require('./routes/tours');
const userRouter = require('./routes/users');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error');

const app = express();

// middlewares

const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW * 60 * 1000,
  limit: process.env.RATE_LIMIT,
  message: 'Rate limit exceeded. Please try again later.',
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);

app.use(helmet());

// Parse incoming requests with JSON payloads.
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  res.requestTime = new Date().toLocaleString();
  next();
});

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(404, `${req.originalUrl} not found`));
});

app.use(globalErrorHandler);

// server start
module.exports = app;
