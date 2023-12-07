const Tour = require('../models/tours');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

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
exports.getAllTours = async (req, res, next) => {
  try {
    // Execute Query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const allTours = await features.query;

    res.status(200).json({
      status: '✅ success',
      results: allTours.length,
      data: {
        tours: allTours,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getTour = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);
    if (!tour) {
      return next(new AppError(404, `No tour found with ID: ${id}`));
    }
    res.status(200).json({
      status: '✅ success',
      data: {
        tours: tour,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createTour = async (req, res, next) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: '✅ success',
      message: 'Tour created',
      data: newTour,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTour = async (req, res, next) => {
  const { id } = req.params;
  try {
    const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTour) {
      return next(new AppError(404, `No tour found with ID: ${id}`));
    }

    res.status(200).json({
      status: '✅ success',
      message: 'Tour Updated',
      data: updatedTour,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTour = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedTour = await Tour.findByIdAndDelete(id);
    if (!deletedTour) {
      return next(new AppError(404, `No tour found with ID: ${id}`));
    }
    res.status(204).json({
      status: '✅ success',
      message: 'Tour created',
      data: {
        deletedTour,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getTourStats = async (req, res, next) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratings: { $gte: 1.3 } },
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
      status: '✅ success',
      data: {
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMonthlyPlan = async (req, res, next) => {
  try {
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
      status: '✅ success',
      results: plan.length,
      data: {
        plan,
      },
    });
  } catch (error) {
    next(error);
  }
};
