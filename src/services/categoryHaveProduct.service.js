const httpStatus = require('http-status');
const CategoryHaveProduct = require('../models/categoryHaveProduct.model'); // Assuming you have this model defined
const Product = require('../models/product.model'); // Assuming you have this model defined
const ApiError = require('../utils/ApiError');

/**
 * Create a CategoryHaveProduct
 * @param {Object} categoryProductBody
 * @returns {Promise<CategoryHaveProduct>}
 */
const createCategoryHaveProduct = async (categoryProductBody) => {
  const categoryProduct = await CategoryHaveProduct.create(categoryProductBody);
  return categoryProduct;
};

/**
 * Query for CategoryHaveProduct entries
 * @param {Object} filter - MongoDB filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCategoryHaveProducts = async (filter, options) => {
  // Default sort by creation date in descending order
  options.sort = { createdAt: -1 };
  const categoryProductList = await CategoryHaveProduct.paginate(filter, options);
  return categoryProductList;
};

/**
 * Get CategoryHaveProduct by ID
 * @param {ObjectId} id
 * @returns {Promise<CategoryHaveProduct>}
 */
const getCategoryHaveProductById = async (id) => {
  // Find the category by its ID
  const categoryProduct = await CategoryHaveProduct.findById(id);

  if (!categoryProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CategoryHaveProduct not found');
  }

  // Now, fetch the product data using the productId from the category
  const product = await Product.findById(categoryProduct.productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found for this category');
  }

  // Return both category and product data
  return { categoryProduct, product };
};


/**
 * Update CategoryHaveProduct by ID
 * @param {ObjectId} categoryProductId
 * @param {Object} updateBody
 * @returns {Promise<CategoryHaveProduct>}
 */
const updateCategoryHaveProductById = async (categoryProductId, updateBody) => {
  const categoryProduct = await getCategoryHaveProductById(categoryProductId);
  console.log("Updating categoryProductId:", categoryProductId);
  if (!categoryProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CategoryHaveProduct not found');
  }
  Object.assign(categoryProduct, updateBody);
  await categoryProduct.save();
  return categoryProduct;
};

/**
 * Delete CategoryHaveProduct by ID
 * @param {ObjectId} categoryProductId
 * @returns {Promise<CategoryHaveProduct>}
 */
const deleteCategoryHaveProductById = async (categoryProductId) => {
  const categoryProduct = await getCategoryHaveProductById(categoryProductId);
  if (!categoryProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CategoryHaveProduct not found');
  }
  await categoryProduct.remove();
  return categoryProduct;
};

module.exports = {
  createCategoryHaveProduct,
  queryCategoryHaveProducts,
  getCategoryHaveProductById,
  updateCategoryHaveProductById,
  deleteCategoryHaveProductById,
};
