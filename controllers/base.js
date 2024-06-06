exports.baseController = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'API is up and running!',
    endpoints: {
      '/': 'Returns API information',
      '/api/v1/tours': {
        description: 'Manage tours',
        methods: {
          get: 'Get all tours, or a specific tour by ID',
          post: 'Create a new tour',
          put: 'Update an existing tour',
          delete: 'Delete a tour',
        },
      },
      '/api/v1/users': {
        description: 'Manage users',
        methods: {
          get: 'Get all users, or a specific user by ID',
          post: 'Create a new user',
          put: 'Update an existing user',
          delete: 'Delete a user',
        },
      },
      '/api/v1/reviews': {
        description: 'Manage reviews',
        methods: {
          get: 'Get all reviews, or a specific review by ID',
          post: 'Create a new review',
          put: 'Update an existing review',
          delete: 'Delete a review',
        },
      },
      '/api/v1/bookings': {
        description: 'Manage bookings',
        methods: {
          get: 'Get all bookings, or a specific booking by ID',
          post: 'Create a new booking',
          put: 'Update an existing booking',
          delete: 'Delete a booking',
        },
      },
    },
  });
};
