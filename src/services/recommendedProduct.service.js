const httpStatus = require('http-status');
const { RecommendedProduct} = require('../models'); // Assuming you have this model defined
const {Product} = require('../models'); // Assuming you have this model defined
const ApiError = require('../utils/ApiError');

/**
 * Create a RecommendedProduct
 * @param {Object} recommendedProductBody
 * @returns {Promise<RecommendedProduct>}
 */
const createRecommendedProduct = async (recommendedProductBody) => {
  const recommendedProduct = await RecommendedProduct.create(recommendedProductBody);
  return recommendedProduct;
};

/**
 * Query for RecommendedProduct entries
 * @param {Object} filter - MongoDB filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRecommendedProducts = async (filter, options) => {
  // Default sort by creation date in descending order
  options.sort = { createdAt: -1 };
  const recommendedProductList = await RecommendedProduct.paginate(filter, options);
  return recommendedProductList;
};

/**
 * Get RecommendedProduct by ID
 * @param {ObjectId} id
 * @returns {Promise<RecommendedProduct>}
 */
const getRecommendedProductById = async (id) => {
  // Find the category by its ID
  const recommendedProduct = await RecommendedProduct.findById(id);

  if (!recommendedProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RecommendedProduct not found');
  }

  // Now, fetch the product data using the productId from the category
  const product = await Product.findById(recommendedProduct.productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found for this category');
  }

  // Return both category and product data
  return { recommendedProduct, product };
};


/**
 * Update RecommendedProduct by ID
 * @param {ObjectId} recommendedProductId
 * @param {Object} updateBody
 * @returns {Promise<RecommendedProduct>}
 */
const updateRecommendedProductById = async (recommendedProductId, updateBody) => {
  const recommendedProduct = await getRecommendedProductById(recommendedProductId);
  console.log("Updating recommendedProductId:", recommendedProductId);
  if (!recommendedProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RecommendedProduct not found');
  }
  Object.assign(recommendedProduct, updateBody);
  await recommendedProduct.save();
  return recommendedProduct;
};

/**
 * Delete RecommendedProduct by ID
 * @param {ObjectId} recommendedProductId
 * @returns {Promise<RecommendedProduct>}
 */
const deleteRecommendedProductById = async (recommendedProductId) => {
  const recommendedProduct = await getRecommendedProductById(recommendedProductId);
  if (!recommendedProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RecommendedProduct not found');
  }
  await recommendedProduct.remove();
  return recommendedProduct;
};

module.exports = {
  createRecommendedProduct,
  queryRecommendedProducts,
  getRecommendedProductById,
  updateRecommendedProductById,
  deleteRecommendedProductById,
};
