const mongoose = require('mongoose');

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

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
