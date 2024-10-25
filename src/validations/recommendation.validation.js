const Joi = require('joi');

// Create Recommendation validation schema
const createRecommendation = {
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .trim()
      .max(50) // You can set a maximum length for the name
      .messages({
        'string.empty': '"name" cannot be empty',
        'string.max': '"name" must be less than or equal to 50 characters',
        'any.required': '"name" is required',
      }),
  }),
};

// Update Recommendation validation schema
const updateRecommendation = {
  body: Joi.object().keys({
    name: Joi.string()
      .trim()
      .max(50) // You can set a maximum length for the name
      .messages({
        'string.empty': '"name" cannot be empty',
        'string.max': '"name" must be less than or equal to 50 characters',
      }),
  }),
};

module.exports = {
  createRecommendation,
  updateRecommendation,
};