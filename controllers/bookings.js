const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tours');
const AppError = require('../utils/appError');
const handleAsync = require('../utils/handleAsync');

exports.getCheckoutSession = handleAsync(async (req, res, next) => {
  // Get currently booked tour
  const { tourId } = req.params;
  const tour = await Tour.findById(tourId);

  if (!tour) {
    return new AppError(404, `No tour found with this ID.`);
  }
  // Create Checkout session

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'inr',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`${tour.imageCover}`],
          },
        },
        quantity: 1,
      },
    ],
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tours`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
  });

  // Send session as response
  // res.redirect(303, session.url);
  console.log(tour.imageCover);
  res.status(200).json({
    status: 'success',
    session,
  });
});
