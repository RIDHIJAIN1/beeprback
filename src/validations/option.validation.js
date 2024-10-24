const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOption = {
  body: Joi.object().keys({
    question_id: Joi.string().required().custom(objectId), // Reference to the question ID
    type: Joi.string().required().valid('next_question', 'product_category'), // Type must be one of the enum values
    next_question_id: Joi.when('type', {
      is: 'next_question',
      then: Joi.string().required().custom(objectId), // Required if type is 'next_question'
      otherwise: Joi.forbidden(), // Disallow this field otherwise
    }),
    category_id: Joi.when('type', {
      is: 'product_category',
      then: Joi.string().required().custom(objectId), // Required if type is 'product_category'
      otherwise: Joi.forbidden(), // Disallow this field otherwise
    }),
    value: Joi.string().required().trim(), // The value associated with the option
  }),
};
const getOptions = {
  query: Joi.object().keys({
    question_id: Joi.string().custom(objectId), // Optional filter by question ID
    category_id: Joi.string().custom(objectId), // Optional filter by category ID
    type: Joi.string().valid('next_question', 'product_category'), // Optional filter by type
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOption = {
  params: Joi.object().keys({
    optionId: Joi.string().custom(objectId).required(), // Option ID is required
  }),
};

const updateOption = {
  params: Joi.object().keys({
    optionId: Joi.string().required().custom(objectId), // Option ID to be updated
  }),
  body: Joi.object()
    .keys({
      question_id: Joi.string().custom(objectId),
      type: Joi.string().valid('next_question', 'product_category'),
      next_question_id: Joi.when('type', {
        is: 'next_question',
        then: Joi.string().custom(objectId),
        otherwise: Joi.forbidden(),
      }),
      category_id: Joi.when('type', {
        is: 'product_category',
        then: Joi.string().custom(objectId),
        otherwise: Joi.forbidden(),
      }),
      value: Joi.string().trim(),
    })
    .min(1), // At least one field must be provided for update
};

const deleteOption = {
  params: Joi.object().keys({
    optionId: Joi.string().custom(objectId).required(), // Option ID to be deleted
  }),
};

module.exports = {
  createOption,
  getOptions,
  getOption,
  updateOption,
  deleteOption,
};
