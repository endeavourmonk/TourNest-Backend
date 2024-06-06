const express = require('express');

const { protect } = require('../controllers/auth');
const { getCheckoutSession } = require('../controllers/bookings');

const router = express.Router();
router.get('/checkout-session/:tourId', protect, getCheckoutSession);

module.exports = router;
