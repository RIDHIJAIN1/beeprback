const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {categoryService} = require('../services');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');

// Create a new category
const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(httpStatus.CREATED).send(category);
});

// Get all categories
const getCategories = catchAsync(async (req, res) => {
  const filter = {}
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

    if (req.query.id) {
    filter._id = req.query.id; // MongoDB uses `_id` for document IDs
  }

  if (!options.sortBy) {
    options.sortBy = 'createdAt:desc';
  }
  const categories = await categoryService.queryCategories(filter,options);
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


const fetchActiveCategory = catchAsync(async (req, res) => {
  await categoryService.fetchActiveCategory(req.params.categoryId);
  res.status(httpStatus.OK).send({message:"Status changed successfully!"});
});

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  statusChangeCategory, // Export the soft delete function
};