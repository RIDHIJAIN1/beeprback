const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
// const { required } = require('joi');

const CategoryHaveProductSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Reference to the Seller model
      required: true,
    },
  categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', // Reference to the Seller model
      required: true,
    },
  
    
  },
  {
    timestamps: true,
  }
);

// Add plugin that converts mongoose to json
CategoryHaveProductSchema.plugin(toJSON);
CategoryHaveProductSchema.plugin(paginate);

/**
 * @typedef Product
 */
const CategoryProduct = mongoose.model('CategoryProduct', CategoryHaveProductSchema);
module.exports = CategoryProduct;