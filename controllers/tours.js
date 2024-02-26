const Tour = require('../models/tours');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const handleAsync = require('../utils/handleAsync');

// Middleware
exports.mostPopularBuilder = (req, res, next) => {
  req.query = {
    price: { lte: 1500 },
    ratings: { gte: 4 },
    fields: 'name, duration, price, ratings, totalRatings, startDates',
    limit: 50,
    page: 1,
    sort: 'price, -ratings, -totalRatings',
  };
  next();
};

// Route Handlers
exports.getAllTours = handleAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Execute Query
  const allTours = await features.query;

  res.status(200).json({
    status: 'success',
    results: allTours.length,
    data: {
      tours: allTours,
    },
  });
});

exports.getTour = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findById(id).populate({
    path: 'reviews',
  });
  if (!tour) {
    return next(new AppError(404, `No tour found with ID: ${id}`));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tours: tour,
    },
  });
});

exports.createTour = handleAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Tour created',
    data: newTour,
  });
});

exports.updateTour = handleAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedTour) {
    return next(new AppError(404, `No tour found with ID: ${id}`));
  }

  res.status(200).json({
    status: 'success',
    message: 'Tour Updated',
    data: updatedTour,
  });
});

exports.deleteTour = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  const deletedTour = await Tour.findByIdAndDelete(id);
  if (!deletedTour) {
    return next(new AppError(404, `No tour found with ID: ${id}`));
  }
  res.status(204).json({
    status: 'success',
    message: 'Tour created',
    data: {
      deletedTour,
    },
  });
});

exports.getTourStats = handleAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratings: { $gte: 1 } },
    },
    {
      $group: {
        _id: '$difficulty',
        totalTours: { $sum: 1 },
        avgRatings: { $avg: '$ratings' },
        totalRatings: { $sum: '$totalRatings' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { totalTours: -1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = handleAsync(async (req, res, next) => {
  const year = Number(req.params.year);
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: false },
    },
    {
      $sort: { numTours: -1, month: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: {
      plan,
    },
  });
});
