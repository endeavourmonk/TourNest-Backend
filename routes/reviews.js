const express = require('express');
const {
  getAllReviews,
  getReview,
  setTourAndUser,
  validateReviewCreator,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviews');

const { protect, restrictToRole } = require('../controllers/auth');

const router = express.Router({ mergeParams: true });

router.get('/', getAllReviews);
router.post(
  '/',
  protect,
  restrictToRole('user', 'admin'),
  setTourAndUser,
  createReview,
);
router.get('/:id', getReview);
router.patch(
  '/:id',
  protect,
  restrictToRole('user', 'admin'),
  validateReviewCreator,
  updateReview,
);
router.delete('/:id', protect, restrictToRole('user', 'admin'), deleteReview);

module.exports = router;
