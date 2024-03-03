const Review = require('../models/reviews');
const AppError = require('../utils/appError');
const handleAsync = require('../utils/handleAsync');
const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} = require('./handleFactory');

exports.getAllReviews = getAll(Review);
exports.getReview = getOne(Review);

exports.setTourAndUser = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.id;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.validateReviewCreator = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findById(id);

  if (!review) return next(new AppError(404, `No reveiw found for this id`));
  if (review.user.id !== req.user.id)
    return next(new AppError(400, `This Reveiw is not created by you`));

  next();
});

exports.createReview = createOne(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);
