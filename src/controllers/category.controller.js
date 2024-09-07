const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const categoryService = require('../services/category.service');
const ApiError = require('../utils/ApiError');

// Create a new category
const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(httpStatus.CREATED).send(category);
});

// Get all categories
const getCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.queryCategories({}, {});
  res.send(categories);
});

// Get category by ID
const getCategory = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  res.send(category);
});

// Update a category by ID
const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategoryById(req.params.categoryId, req.body);
  res.send(category);
});

// Toggle category status
const statusChangeCategory = catchAsync(async (req, res) => {
  await categoryService.statusChangeById(req.params.categoryId);
  res.status(httpStatus.OK).send({message:"Status changed successfully!"});
});

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  statusChangeCategory, // Export the soft delete function
};