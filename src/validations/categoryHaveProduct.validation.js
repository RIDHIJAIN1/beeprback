const Joi = require('joi');
const { objectId } = require('./custom.validation');

// Validation for creating a CategoryProduct
const createCategoryProduct = {
  body: Joi.object().keys({
    productId: Joi.string().required().custom(objectId), // Reference to the product ID
    categoryId: Joi.string().required().custom(objectId), // Reference to the category ID
  }),
};

// Validation for querying CategoryProducts (with pagination)
const getCategoryProducts = {
  query: Joi.object().keys({
    productId: Joi.string().custom(objectId), // Optional filter by product ID
    categoryId: Joi.string().custom(objectId), // Optional filter by category ID
    limit: Joi.number().integer(), // Pagination limit
    page: Joi.number().integer(), // Pagination page number
  }),
};

// Validation for getting a single CategoryProduct by ID
const getCategoryProduct = {
  params: Joi.object().keys({
    categoryProductId: Joi.string().custom(objectId).required(), 
    // ID of the CategoryProduct
  }),
};

// Validation for updating a CategoryProduct
const updateCategoryProduct = {
  params: Joi.object().keys({
    categoryProductId: Joi.string().required().custom(objectId), // ID of the CategoryProduct to update
  }),
  body: Joi.object()
    .keys({
      productId: Joi.string().custom(objectId), // Optionally update product ID
      categoryId: Joi.string().custom(objectId), // Optionally update category ID
    })
    .min(1), // At least one field must be provided for update
};

// Validation for deleting a CategoryProduct by ID
const deleteCategoryProduct = {
  params: Joi.object().keys({
    categoryProductId: Joi.string().custom(objectId).required(), // ID of the CategoryProduct to delete
  }),
};

module.exports = {
  createCategoryProduct,
  getCategoryProducts,
  getCategoryProduct,
  updateCategoryProduct,
  deleteCategoryProduct,
};
