const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProduct = {
  body: Joi.object().keys({
   
    title: Joi.string().required(),
    deliveryOption: Joi.string().required().valid('standard', 'express', 'overnight'), // Example delivery options
    weight: Joi.number().required().min(0), // Weight must be a non-negative number
    description: Joi.string().required(),
    categoryId: Joi.string().required().custom(objectId), // Validate categoryId
    // Reference to Seller ID
    // reviews: Joi.array().items(
    //   Joi.object().keys({
    //     user: Joi.string().custom(objectId).required(), // Reference to User ID
    //     rating: Joi.number().required().min(1).max(5), // Rating should be between 1 and 5
    //     comment: Joi.string(),
    //     createdAt: Joi.date().default(Date.now), // Optional, defaults to now
    //   })
    // ),
  }),
  files: Joi.object().keys({
    image: Joi.object().required(), // Check for the file
  }).required(),
};

const getProducts = {
  query: Joi.object().keys({
    title: Joi.string(),
    category: Joi.string(),
    sellerId: Joi.string().custom(objectId),
    id: Joi.string().custom(objectId), // Optional filter by seller ID
  
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getProduct = {
  params: Joi.object().keys({
     id: Joi.string().custom(objectId).optional(), // Optional productId
    sellerId: Joi.string().custom(objectId).optional(),  // Optional sellerId
  }).or('productId', 'sellerId')
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      image: Joi.string(),
      title: Joi.string(),
      deliveryOption: Joi.string().valid('standard', 'express', 'overnight'), // Example delivery options
      weight: Joi.number().min(0),
      description: Joi.string(),
      categoryId: Joi.string(),
      sellerId: Joi.string().custom(objectId), // Optional to update seller ID
      reviews: Joi.array().items(
        Joi.object().keys({
          user: Joi.string().custom(objectId).required(), // Reference to User ID
          rating: Joi.number().min(1).max(5),
          comment: Joi.string(),
          createdAt: Joi.date(),
        })
      ),
    })
    .min(1), // At least one field must be provided for update
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};