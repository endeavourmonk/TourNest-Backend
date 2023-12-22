const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const tourRouter = require('./routes/tours');
const userRouter = require('./routes/users');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error');

const app = express();

// middlewares

// securing req headers
app.use(helmet());

// Apply the rate limiting middleware to all requests.
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW * 60 * 1000,
  limit: process.env.RATE_LIMIT,
  message: 'Rate limit exceeded. Please try again later.',
});

app.use(limiter);

// Parse incoming requests with JSON payloads.
app.use(express.json({ limit: '10kb' }));

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
