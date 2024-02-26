const express = require('express');
const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviews');

const { protect, restrictToRole } = require('../controllers/auth');

const router = express.Router({ mergeParams: true });

router.get('/', getAllReviews);
router.post('/', protect, restrictToRole('user', 'admin'), createReview);
router.get('/:id', getReview);
router.patch('/:id', protect, restrictToRole('user', 'admin'), updateReview);
router.delete('/:id', protect, restrictToRole('user', 'admin'), deleteReview);

module.exports = router;
