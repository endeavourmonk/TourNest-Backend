const express = require('express');
const { protect, restrictToRole } = require('../controllers/auth');
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  mostPopularBuilder,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tours');

const reveiwRouter = require('./reviews');

const router = express.Router();

// nested route "http://localhost:8000/api/v1/tours/222121/reviews"
router.use('/:tourId/reviews', reveiwRouter);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictToRole('admin'), createTour);

router.route('/most-popular').get(mostPopularBuilder, getAllTours);
router.route('/tour-stats').get(protect, restrictToRole('admin'), getTourStats);

router
  .route('/monthly-plan/:year')
  .get(protect, restrictToRole('admin'), getMonthlyPlan);

router
  .route('/:id')
  .get(protect, getTour)
  .patch(protect, restrictToRole('admin'), updateTour)
  .delete(protect, restrictToRole('admin'), deleteTour);

// router.route('/:slug').get(getTour);

module.exports = router;
