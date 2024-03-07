const mongoose = require('mongoose');
const slugify = require('slugify');

const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'Point',
    enum: ['Point'],
  },
  coordinates: [Number],
  address: String,
  city: String,
  state: String,
  country: String,
  description: String,
  day: Number,
});

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } };
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour cannot be without name'],
      unique: true,
      trim: true,
      maxLength: [50, 'Tour name cannot be more than 50 characters'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour cannot be without duration'],
    },
    maxGroupSize: Number,
    difficulty: {
      type: String,
      required: [true, 'A Tour cannot be without difficulty level'],
      enum: {
        values: ['Easy', 'Moderate', 'Difficult'],
        message: 'Difficulty is either: Easy, Moderate or Difficult',
      },
    },
    price: {
      type: Number,
      required: [true, 'A tour cannot be without price'],
    },
    discount: {
      type: Number,
      default: 0,
      validate: {
        validator: function (val) {
          return val <= this.price;
        },
        message: 'Discount Price cannot be more than the tour price',
      },
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    totalRatings: {
      type: Number,
      default: 0,
      min: [0, 'Number of Ratings cannot be negative'],
    },
    description: {
      type: String,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    imageCover: {
      type: String,
      required: true,
    },
    images: [String],
    startDates: {
      type: [Date],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    slug: String,
    premium: {
      type: Boolean,
      default: false,
    },
    startLocation: locationSchema,
    locations: [locationSchema],
    guides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  opts,
);

// indexes
tourSchema.index({ slug: 1 });
tourSchema.index({ price: -1, rating: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// virtual property
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'tour',
});

// document middleware to create the slug on tour creation
tourSchema.pre('save', async function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// query middleware to populate the guides array by the guides from User Collection
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-password -passwordLastChanged -__v -active',
  });

  next();
});

// query middleware to update the slug on the tour update
tourSchema.pre('findOneAndUpdate', function (next) {
  // Returns the current update operations as a JSON object.
  const update = this.getUpdate();

  if (update.name) {
    const slug = slugify(update.name, { lower: true });
    update.slug = slug;
  }
  next();
});

// aggregate middleware to filter the non-premium tour by adding a match stage
// tourSchema.pre('aggregate', function (next) {
//   this._pipeline.unshift({ $match: { premium: false } });
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
