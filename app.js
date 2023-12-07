const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tours');
const userRouter = require('./routes/users');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error');

const app = express();

// middlewares
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
