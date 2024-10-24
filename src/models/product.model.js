const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const productSchema = mongoose.Schema(
  {
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller', // Reference to the Seller model
        required: true,
      },
    recommendationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recommendation', // Reference to the Seller model
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
    qty: {
      type: Number,
      required: true,
      min: 0, // Weight cannot be negative
    },
    unit: {
      type: String,
      required: true,
      enum: ['mg', 'g', 'kg', 'l' , 'ml'],
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Weight cannot be negative
    },
    duplicatePrice: {
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
        default: false, 
      },
    
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