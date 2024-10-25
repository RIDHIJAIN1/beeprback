const Joi = require('joi');
const { objectId } = require('./custom.validation');

// Validation for creating a RecommendedProduct
const createRecommendedProduct = {
  body: Joi.object().keys({
    productId: Joi.string().required().custom(objectId), // Reference to the product ID
    recommendationId: Joi.string().required().custom(objectId), // Reference to the Recommended ID
  }),
};

// Validation for querying RecommendedProducts (with pagination)
const getRecommendedProducts = {
  query: Joi.object().keys({
    productId: Joi.string().custom(objectId), // Optional filter by product ID
    recommendationId: Joi.string().custom(objectId), // Optional filter by Recommended ID
    limit: Joi.number().integer(), // Pagination limit
    page: Joi.number().integer(), // Pagination page number
  }),
};

// Validation for getting a single RecommendedProduct by ID
const getRecommendedProduct = {
  params: Joi.object().keys({
    recommendedProductId: Joi.string().custom(objectId).required(), 
    // ID of the RecommendedProduct
  }),
};

// Validation for updating a RecommendedProduct
const updateRecommendedProduct = {
  params: Joi.object().keys({
    recommendedProductId: Joi.string().required().custom(objectId), // ID of the RecommendedProduct to update
  }),
  body: Joi.object()
    .keys({
      productId: Joi.string().custom(objectId), // Optionally update product ID
      recommendationId: Joi.string().custom(objectId), // Optionally update Recommended ID
    })
    .min(1), // At least one field must be provided for update
};

// Validation for deleting a RecommendedProduct by ID
const deleteRecommendedProduct = {
  params: Joi.object().keys({
    recommendedProductId: Joi.string().custom(objectId).required(), // ID of the RecommendedProduct to delete
  }),
};

module.exports = {
  createRecommendedProduct,
  getRecommendedProducts,
  getRecommendedProduct,
  updateRecommendedProduct,
  deleteRecommendedProduct,
};
