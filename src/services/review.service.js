const httpStatus = require('http-status');
const { Review } = require('../models');
const ApiError = require('../utils/ApiError');
const { Product } = require('../models');
const {  User } = require('../models');

/**
 * Create a review
 * @param {Object} reviewBody
 * @returns {Promise<Review>}
 */
const createReview = async (reviewBody) => {
  const userExists = await User.findById(reviewBody.user_id);
  const productExists = await Product.findById(reviewBody.product_id);

  if (!userExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!productExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  return Review.create(reviewBody);
};

/**
 * Query for reviews
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryReviews = async (filter, options) => {
  const reviews = await Review.paginate(filter, options);
  return reviews;
};

/**
 * Get review by id
 * @param {ObjectId} id
 * @returns {Promise<Review>}
 */
const getReviewById = async (id) => {
  const review = await Review.findById(id);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  return review;
};

/**
 * Update review by id
 * @param {ObjectId} reviewId
 * @param {Object} updateBody
 * @returns {Promise<Review>}
 */
const updateReviewById = async (reviewId, updateBody) => {
  const review = await getReviewById(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  Object.assign(review, updateBody);
  await review.save();
  return review;
};

/**
 * Delete review by id
 * @param {ObjectId} reviewId
 * @returns {Promise<Review>}
 */
const deleteReviewById = async (reviewId) => {
  const review = await getReviewById(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  await review.remove();
  return review;
};

/**
 * Count reviews
 * @returns {Promise<number>}
 */
const countReviews = async () => {
  return Review.countDocuments();
};

module.exports = {
  createReview,
  queryReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById,
  countReviews,
};
