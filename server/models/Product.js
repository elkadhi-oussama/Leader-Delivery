const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true
    },
    images: [String],
    description: {
      type: String,
      required: [true, 'Please provide a product description']
    },
    brand: {
      type: String,
      required: [true, 'Please provide a brand']
    },
    category: {
      type: String,
      required: [true, 'Please provide a category']
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative']
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Calculate average rating
productSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    this.rating =
      this.reviews.reduce((acc, item) => item.rating + acc, 0) /
      this.reviews.length;
    this.numReviews = this.reviews.length;
  }
  return this.save();
};

module.exports = mongoose.model('Product', productSchema); 