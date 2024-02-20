const express = require('express');
const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/review');

const { protect, restrictToRole } = require('../controllers/auth');

const router = express.Router();

router.route('/').get(getAllReviews).post(createReview);
router.get('/:id', getReview);
router.patch('/:id', protect, restrictToRole('user', 'admin'), updateReview);
router.delete('/:id', protect, restrictToRole('user', 'admin'), deleteReview);

module.exports = router;
