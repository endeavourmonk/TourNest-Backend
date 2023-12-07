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
} = require('../controllers/tourController');

const router = express.Router();

router
  .route('/')
  .get(protect, getAllTours)
  .post(protect, restrictToRole('admin'), createTour);

router.route('/mostPopular').get(mostPopularBuilder, getAllTours);
router.route('/tour-stats').get(protect, restrictToRole('admin'), getTourStats);

router
  .route('/monthly-plan/:year')
  .get(protect, restrictToRole('admin'), getMonthlyPlan);

router
  .route('/:id')
  .get(protect, getTour)
  .put(protect, restrictToRole('admin'), updateTour)
  .delete(protect, restrictToRole('admin'), deleteTour);

// router.route('/:slug').get(getTour);

module.exports = router;
