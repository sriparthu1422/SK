const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number },
    discount: { type: Number, default: 0 },
    category: {
      type: String,
      required: true,
      enum: ['Silk Sarees', 'Cotton Sarees', 'Designer Sarees', 'Bridal Sarees', 'Traditional Wear'],
    },
    fabric: { type: String },
    colors: [{ type: String }],
    images: [{ type: String }],
    stock: { type: Number, required: true, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Update rating on review change
productSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    this.rating =
      this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
};

module.exports = mongoose.model('Product', productSchema);
