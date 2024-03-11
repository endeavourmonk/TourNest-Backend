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
  // getBySlug,
  getToursWithin,
  getToursDistance,
  uploadtourPhotos,
  resizeTourPhotos,
  uploadToCloudinary,
} = require('../controllers/tours');

const reveiwRouter = require('./reviews');

const router = express.Router();

// nested route "http://localhost:8000/api/v1/tours/222121/reviews"
router.use('/:id/reviews', reveiwRouter);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictToRole('admin'), createTour);

router.get('/most-popular', mostPopularBuilder, getAllTours);
router.get('/tour-stats', protect, restrictToRole('admin'), getTourStats);

router.get(
  '/monthly-plan/:year',
  protect,
  restrictToRole('admin'),
  getMonthlyPlan,
);

router
  .route('/tours-within/:distance/center/:latlon/unit/:unit')
  .get(getToursWithin);

router.get('/distances/center/:latlon/unit/:unit', getToursDistance);

router
  .route('/:id')
  .get(protect, getTour)
  .patch(
    protect,
    restrictToRole('admin'),
    uploadtourPhotos,
    resizeTourPhotos,
    uploadToCloudinary,
    updateTour,
  )
  .delete(protect, restrictToRole('admin'), deleteTour);

// router.get('/:slug', getBySlug);

module.exports = router;
