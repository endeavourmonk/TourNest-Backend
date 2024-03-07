const Tour = require('../models/tours');
const AppError = require('../utils/appError');
const handleAsync = require('../utils/handleAsync');

const {
  getAll,
  // getOne,
  updateOne,
  deleteOne,
  createOne,
} = require('./handleFactory');

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

exports.getAllTours = getAll(Tour);
exports.createTour = createOne(Tour);
exports.updateTour = updateOne(Tour);
exports.deleteTour = deleteOne(Tour);

exports.getTour = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  const doc = await Tour.findById(id).populate({
    path: 'reviews',
    select: '-__v',
  });

  if (!doc) {
    return next(new AppError(404, `No doc found with this ID`));
  }

  res.status(200).json({
    status: 'success',
    message: 'document fetched',
    data: doc,
  });
});

exports.getBySlug = handleAsync(async (req, res, next) => {
  const { slug } = req.params;
  const doc = await Tour.findOne({ slug: slug });

  if (!doc) {
    return next(new AppError(404, `No doc found with this slug`));
  }

  res.status(200).json({
    status: 'success',
    message: 'document fetched',
    data: doc,
  });
});

exports.getToursWithin = handleAsync(async (req, res, next) => {
  const { distance, latlon, unit } = req.params;
  const [latitude, longitude] = latlon.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!latitude || !longitude)
    return next(
      new AppError(
        400,
        `Please specify latitude and longitude in 'lat,log' format`,
      ),
    );

  const tours = await Tour.find({
    startLocation: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    message: 'document fetched',
    data: tours,
  });
});

exports.getToursDistance = handleAsync(async (req, res, next) => {
  const { latlon, unit } = req.params;
  const [latitude, longitude] = latlon.split(',');

  const multiplier = unit === 'km' ? 0.001 : 0.00062137;

  if (!latitude || !longitude)
    return next(
      new AppError(
        400,
        `Please specify latitude and longitude in 'lat,log' format`,
      ),
    );

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [longitude * 1, latitude * 1] },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: { name: 1, distance: 1 },
    },
    {
      $sort: { distance: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    message: 'document fetched',
    data: distances,
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
