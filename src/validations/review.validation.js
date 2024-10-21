const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReview = {
  body: Joi.object().keys({
    user_id: Joi.string().required().custom(objectId), // Validate that user_id is a valid ObjectId
    product_id: Joi.string().required().custom(objectId), // Validate that product_id is a valid ObjectId
    rating: Joi.number().required().min(1).max(5), // Rating should be a number between 1 and 5
    comment: Joi.string().required().min(3).max(500), // Comment should be a string between 3 and 500 characters
  }),
};

const getReviews = {
  query: Joi.object().keys({
    user_id: Joi.string().custom(objectId), // Optional filter for user_id, must be a valid ObjectId if provided
    product_id: Joi.string().custom(objectId), // Optional filter for product_id, must be a valid ObjectId if provided
    sortBy: Joi.string(), // Optional sort field
    limit: Joi.number().integer(), // Optional limit for pagination
    page: Joi.number().integer(), // Optional page number for pagination
  }),
};

const getReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId), // Validate that reviewId is a valid ObjectId
  }),
};

const updateReview = {
  params: Joi.object().keys({
    reviewId: Joi.required().custom(objectId), // Validate that reviewId is a valid ObjectId
  }),
  body: Joi.object()
    .keys({
      rating: Joi.number().min(1).max(5), // Optional, but if provided, it must be between 1 and 5
      comment: Joi.string().min(3).max(500), // Optional, but if provided, it should be between 3 and 500 characters
    })
    .min(1), // Ensure at least one field is provided for update
};

const deleteReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId), // Validate that reviewId is a valid ObjectId
  }),
};

module.exports = {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
};
