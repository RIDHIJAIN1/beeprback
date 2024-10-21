const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const categoryHaveProductService = require('../services/categoryHaveProduct.service');

/**
 * Create a new CategoryHaveProduct
 */
const createCategoryHaveProduct = catchAsync(async (req, res) => {
  // Collect validated data from the request body
  const categoryProductData = {
    categoryId: req.body.categoryId, // Match schema field name
    productId: req.body.productId, 
  };

  // Call the service layer to create the CategoryHaveProduct entry
  const categoryProduct = await categoryHaveProductService.createCategoryHaveProduct(categoryProductData);

  // Return the created entry with status 201
  res.status(httpStatus.CREATED).send(categoryProduct);
});

/**
 * Get all CategoryHaveProduct with filtering and pagination
 */
const getCategoryHaveProducts = catchAsync(async (req, res) => {
  // Pick filter criteria from the request query (like categoryId or productId)
  const filter = pick(req.query, ['category_id', 'product_id']);

  // Pick options like sortBy, limit, and page for pagination
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  if (!options.sortBy) {
    options.sortBy = 'createdAt:desc'; // Default sorting by creation date (desc)
  }

  // Call the service layer to get the list of CategoryHaveProduct entries
  const categoryProductList = await categoryHaveProductService.queryCategoryHaveProducts(filter, options);

  // Send the list of entries as the response
  res.send({ data: categoryProductList });
});

/**
 * Get a single CategoryHaveProduct by ID
 */
const getCategoryHaveProduct = catchAsync(async (req, res) => {
  // Extract the CategoryHaveProduct ID from request params
  const { categoryProductId } = req.params;

  // Call the service layer to fetch the CategoryHaveProduct by ID
  const categoryProduct = await categoryHaveProductService.getCategoryHaveProductById(categoryProductId);
  
  // If the entry is not found, throw a 404 error
  if (!categoryProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CategoryHaveProduct not found');
  }

  // Return the found entry
  res.send(categoryProduct);
});

/**
 * Update a CategoryHaveProduct by ID
 */
const updateCategoryHaveProduct = catchAsync(async (req, res) => {
    const { categoryProductId } = req.params; // Make sure this matches what you are using in the route
    const updateBody = req.body;
  
    // Call the service layer to update the CategoryHaveProduct by ID with the provided data
    const categoryProduct = await categoryHaveProductService.updateCategoryHaveProductById(categoryProductId, updateBody);
  
    // Send the updated entry as the response
    res.send(categoryProduct);
  });
  

/**
 * Delete a CategoryHaveProduct by ID
 */
const deleteCategoryHaveProduct = catchAsync(async (req, res) => {
  // Call the service layer to delete the CategoryHaveProduct by ID
  await categoryHaveProductService.deleteCategoryHaveProductById(req.params.categoryProductId);

  // Respond with 204 No Content after successful deletion
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCategoryHaveProduct,
  getCategoryHaveProducts,
  getCategoryHaveProduct,
  updateCategoryHaveProduct,
  deleteCategoryHaveProduct,
};
