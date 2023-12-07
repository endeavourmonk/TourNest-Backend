const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(400, message);
};

const handleDuplicateErrors = (err) => {
  const value = err.message.match(/"([^"]*)"/)[0];
  const message = `Duplicate field value: ${value}, Use unique value`;
  return new AppError(400, message);
};

const handleValidationErrors = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(', ')}`;
  return new AppError(400, message);
};

const handleTokenExpiredError = () =>
  new AppError(401, 'Your Token has expired, Please Login Again!');

const handleJsonWebTokenError = () =>
  new AppError(401, 'Unauthorized, Please Login Again!');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // operational trusted error: send to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: 'failed',
      message: err.message,
    });
  } else {
    // Programming or other error: don't send whole error, send generic message to client
    console.error('ERROR: ', err);
    res.status(500).json({
      status: 'failed',
      message: 'Something went wrong',
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateErrors(err);
    if (err.name === 'ValidationError') err = handleValidationErrors(err);
    if (err.name === 'TokenExpiredError') err = handleTokenExpiredError(err);
    if (err.name === 'JsonWebTokenError') err = handleJsonWebTokenError(err);

    sendErrorProd(err, res);
  }
};

module.exports = globalErrorHandler;
