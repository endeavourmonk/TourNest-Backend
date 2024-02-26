const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'A review cannot be empty.'],
    trim: true,
    maxlength: [500, 'A review cannot be longer than 500 characters.'],
    validate: {
      validator: function (value) {
        // Regex to check for bad words or HTML tags
        return !/badword|<[^>]+>/gi.test(value);
      },
      message: 'A review cannot contain bad words or HTML tags.',
    },
  },
  rating: {
    type: Number,
    required: [true, 'A review cannot be without rating.'],
    min: [1, 'Rating cannot be less than 1'],
    max: [5, 'Rating cannot be more than 5'],
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'A review cannot be without tour.'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A review cannot be without user.'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

// Query middleware to add the data in tour and user field on find operation
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name username photo -_id',
  });
  next();
});

// query middleware to change the isEdited field to true if review is updated
reviewSchema.pre('findOneAndUpdate', function (next) {
  // Returns the current update operations as a JSON object.
  const update = this.getUpdate();
  update.isEdited = true;
  update.updatedAt = Date.now();
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
