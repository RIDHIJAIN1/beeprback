const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const productSchema = mongoose.Schema(
  {
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller', // Reference to the Seller model
        required: true,
      },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Reference to the Seller model
        required: true,
      },
    
    image: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    deliveryOption: {
      type: String,
      required: true,
      enum: ['standard', 'express', 'overnight'], // Example delivery options
    },
    weight: {
      type: Number,
      required: true,
      min: 0, // Weight cannot be negative
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Weight cannot be negative
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    deleted: {
        type: Boolean,
        default: false, // Indicates whether the category is "deleted"
      },
    // reviews: [
    //   {
    //     user: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: 'User', // Reference to the User model
    //       required: true,
    //     },
    //     rating: {
    //       type: Number,
    //       required: true,
    //       min: 1,
    //       max: 5, // Assuming a 1 to 5 star rating
    //     },
    //     comment: {
    //       type: String,
    //       trim: true,
    //     },
    //     createdAt: {
    //       type: Date,
    //       default: Date.now,
    //     },
    //   },
    // ],
    
  },
  {
    timestamps: true,
  }
);

// Add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

/**
 * @typedef Product
 */
const Product = mongoose.model('Product', productSchema);
module.exports = Product;