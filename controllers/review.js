const Review = require('../models/reviews');
const AppError = require('../utils/appError');

exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({});
    res.status(200).json({
      status: '✅ success',
      message: 'reviews fetched',
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

exports.getReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      return next(new AppError(404, `No review with ID: ${id}`));
    }

    res.status(200).json({
      status: '✅ success',
      message: 'review fetched',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json({
      status: '✅ success',
      message: 'Review created',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const updatedReview = await Review.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updatedReview) {
      return next(new AppError(404, `No review with ID: ${id}`));
    }

    res.status(200).json({
      status: '✅ success',
      message: 'Tour created',
      data: updatedReview,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return next(new AppError(404, `No review with ID: ${id}`));
    }

    res.status(201).json({
      status: '✅ success',
      message: 'Tour created',
      data: deletedReview,
    });
  } catch (error) {
    next(error);
  }
};
