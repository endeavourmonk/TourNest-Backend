const Review = require('../models/reviews');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const handleAsync = require('../utils/handleAsync');

exports.getAllReviews = handleAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  // Create features object which takes mongoose query & query string and then
  // append sort and paginate which returned the object with appended query and
  // finally execute that final query.
  const features = new APIFeatures(Review.find(filter), req.query)
    .sort()
    .paginate();
  const reviews = await features.query;

  res.status(200).json({
    status: 'success',
    message: 'reviews fetched',
    results: reviews.length,
    data: reviews,
  });
});

exports.getReview = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findById(id);

  if (!review) {
    return next(new AppError(404, `No review with ID: ${id}`));
  }

  res.status(200).json({
    status: 'success',
    message: 'review fetched',
    data: review,
  });
});

exports.createReview = handleAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const review = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Review created',
    data: review,
  });
});

exports.updateReview = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  const update = req.body;

  // Update the review created by the same user
  const updatedReview = await Review.findOneAndUpdate(
    { _id: id, user: req.user.id },
    update,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedReview) {
    return next(
      new AppError(404, `No review with id or you are not allowed to modify.`),
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Review updated',
    data: updatedReview,
  });
});

exports.deleteReview = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  const deletedReview = await Review.findByIdAndDelete(id);

  if (!deletedReview) {
    return next(new AppError(404, `No review found with this Id`));
  }

  res.status(201).json({
    status: 'success',
    message: 'Review Deleted',
  });
});
