const httpStatus = require('http-status');
const Category = require('../models/category.model'); // Adjust the path as necessary
const ApiError = require('../utils/ApiError');

/**
 * Create a category
 * @param {Object} categoryBody
 * @returns {Promise<Category>}
 */
const createCategory = async (categoryBody) => {
  return Category.create(categoryBody);
};

/**
 * Query for categories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryCategories = async (filter, options) => {
  // Modify the filter to exclude soft-deleted categories
  const categories = await Category.find({ deleted: false, ...filter }, null, options);
  return categories;
};

/**
 * Get category by id
 * @param {ObjectId} id
 * @returns {Promise<Category>}
 */
const getCategoryById = async (id) => {
  return Category.findOne({ _id: id, deleted: false }); // Ensure we only get non-deleted categories
};

/**
 * Update category by id
 * @param {ObjectId} categoryId
 * @param {Object} updateBody
 * @returns {Promise<Category>}
 */
const updateCategoryById = async (categoryId, updateBody) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  Object.assign(category, updateBody);
  await category.save();
  return category;
};

/**
 * Soft delete category by id
 * @param {ObjectId} categoryId
 * @returns {Promise<Category>}
 */
const softDeleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  category.deleted = true; // Mark as deleted
  await category.save();
  return category;
};

module.exports = {
  createCategory,
  queryCategories,
  getCategoryById,
  updateCategoryById,
  softDeleteCategoryById, // Export the soft delete function
};