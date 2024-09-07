const httpStatus = require('http-status');
// const { Product } = require('../models/product.model');
const ApiError = require('../utils/ApiError');
// const Product = require('../models/product.model');
const Product = require('../models/product.model');

/**
 * Create a product
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const createProduct = async (productBody) => {
    if (!Product) {
      throw new Error('Seller model is not defined');
    }
    const product = await Product.create({
      ...productBody,
    });
  
    return product;
  };
  

/**
 * Query for products
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProducts = async (filter, options) => {
  const products = await Product.paginate(filter, options);
  return products;
};

/**
 * Get product by id
 * @param {ObjectId} id
 * @returns {Promise<Product>}
 */
// const getProductById = async (id) => {
//   const product = await Product.findById(id);
//   if (!product) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
//   }
//   return product;
// };

const getProductsBySellerId = async (sellerId) => {
  return Product.find({ sellerId });
};
const getProductById = async (id) => {
  return Product.find({ id });
};

/**
 * Update product by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

/**
 * Delete product by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */


const deleteProductById = async (productId) => {
    const product = await getProductById(productId);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    product.deleted = true; // Mark as deleted
    await product.save();
    return product;
  };
module.exports = {
  createProduct,
  queryProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  getProductsBySellerId
};