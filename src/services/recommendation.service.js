const httpStatus = require('http-status');
const {Recommendation} = require('../models'); // Adjust the path as necessary
const ApiError = require('../utils/ApiError');

/**
 * Create a recommendation
 * @param {Object} recommendationBody
 * @returns {Promise<Recommendation>}
 */
const createRecommendation = async (recommendationBody) => {
  return Recommendation.create(recommendationBody);
};

/**
 * Query for categories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 *  @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const queryRecommendation = async (filter, options) => {
  options.sort = { createdAt: -1 };
  const recommendation = await Recommendation.paginate(filter, options);
  return recommendation;
};

/**
 * Get recommendation by id
 * @param {ObjectId} id
 * @returns {Promise<recommendation>}
 */
const getRecommendationById = async (id) => {
  console.log(`\n\n\n\n ${id} \n\n\n`)
  return Recommendation.findOne({ _id: id, }); // Ensure we only get non-deleted categories
  
};

/**
 * Update recommendation by id
 * @param {ObjectId} recommendationId
 * @param {Object} updateBody
 * @returns {Promise<recommendation>}
 */
const updateRecommendationById = async (recommendationId, updateBody) => {
  const recommendation = await getRecommendationById(recommendationId);
  if (!recommendation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'recommendation not found');
  }
  Object.assign(recommendation, updateBody);
  await recommendation.save();
  return recommendation;
};

/**
 * Soft delete recommendation by id
 * @param {ObjectId} recommendationId
 * @returns {Promise<recommendation>}
 */
const statusChangeById = async (recommendationId) => {
  const recommendation = await getRecommendationById(recommendationId);
  console.log('Recommendation ID:', recommendationId);
  if (!recommendation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'recommendationId not found');
  }
  recommendation.status = !recommendation.status 
  await recommendation.save();
  return recommendation;
};

module.exports = {
  createRecommendation,
  queryRecommendation,
  getRecommendationById,
  updateRecommendationById,
  statusChangeById, // Export the soft delete function
};