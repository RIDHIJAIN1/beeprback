const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
// const { required } = require('joi');

const RecommendedProductSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Reference to the Seller model
      required: true,
    },
    RecommendationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recommendation', // Reference to the Seller model
      required: true,
    },
  
    
  },
  {
    timestamps: true,
  }
);

// Add plugin that converts mongoose to json
RecommendedProductSchema.plugin(toJSON);
RecommendedProductSchema.plugin(paginate);

/**
 * @typedef Product
 */
const RecommendedProduct = mongoose.model('RecommendedProduct', RecommendedProductSchema);
module.exports = RecommendedProduct;