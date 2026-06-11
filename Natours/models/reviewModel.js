const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empyt'],
    },
    rating: {
      type: Number,
      required: [true, 'Review must have a rating'],
      min: [1, 'Rating must be above  0'],
      max: [5, 'Rating must be below  6'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must be belong to user'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must be belong to tour'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    __v: {
      type: Number,
      select: false,
    },
  },
  {
    toJSON: { virtuals: 1 },
    toObject: { virtuals: 1 },
  },
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  await Tour.findByIdAndUpdate(tourId, {
    ratingQuantity: stats && stats[0] ? stats[0].nRating : 0,
    ratingAverage: stats && stats[0] ? stats[0].avgRating : 0,
  });
};
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});
// findByIdandUpdate
// findByIdandDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});
reviewSchema.post(/^findOneAnd/, async function (next) {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
