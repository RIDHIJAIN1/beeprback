const Joi = require('joi');
const { objectId } = require('./custom.validation'); // Assuming you have a custom validation for ObjectId

const createFavourite = {
  body: Joi.object().keys({
    user_id: Joi.string().required().custom(objectId), // Validate that user_id is a valid ObjectId
    product_id: Joi.string().required().custom(objectId), // Validate that product_id is a valid ObjectId
    isLiked: Joi.boolean().optional(), // Optional; if provided, it must be a boolean
  }),
};

const getFavourites = {
  query: Joi.object().keys({
    user_id: Joi.string().custom(objectId), // Optional filter for user_id, must be a valid ObjectId if provided
    product_id: Joi.string().custom(objectId), // Optional filter for product_id, must be a valid ObjectId if provided
    limit: Joi.number().integer().optional(), // Optional limit for pagination
    page: Joi.number().integer().optional(), // Optional page number for pagination
  }),
};

const getFavourite = {
  params: Joi.object().keys({
    favouriteId: Joi.string().custom(objectId), // Validate that favouriteId is a valid ObjectId
  }),
};

const updateFavourite = {
  params: Joi.object().keys({
    favouriteId: Joi.string().required().custom(objectId), // Validate that favouriteId is a valid ObjectId
  }),
  body: Joi.object().keys({
    isLiked: Joi.boolean().optional(), // Optional; if provided, it must be a boolean
  }).min(1), // Ensure at least one field is provided for update
};

const deleteFavourite = {
  params: Joi.object().keys({
    favouriteId: Joi.string().custom(objectId), // Validate that favouriteId is a valid ObjectId
  }),
};

module.exports = {
  createFavourite,
  getFavourites,
  getFavourite,
  updateFavourite,
  deleteFavourite,
};