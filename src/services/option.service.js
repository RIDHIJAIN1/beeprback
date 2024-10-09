const httpStatus = require('http-status');
const  Options  = require('../models/options.model');
const ApiError = require('../utils/ApiError');

/**
 * Create an option
 * @param {Object} optionBody
 * @returns {Promise<Option>}
 */
const createOption = async (optionBody) => {
  // Create a new option using the provided optionBody
  const option = await Options.create({
    ...optionBody,
  });
  return option;
};

/**
 * Query for options
 * @param {Object} filter - MongoDB filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOptions = async (filter, options) => {
  options.sort = { createdAt: -1 }; // Sort by creation date in descending order
  const optionsList = await Options.paginate(filter, options);
  return optionsList;
};

/**
 * Get option by ID
 * @param {ObjectId} id
 * @returns {Promise<Option>}
 */
const getOptionById = async (id) => {
  const option = await Options.findById(id);
  if (!option) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Option not found');
  }
  return option;
};

/**
 * Update option by ID
 * @param {ObjectId} optionId
 * @param {Object} updateBody
 * @returns {Promise<Option>}
 */
const updateOptionById = async (optionId, updateBody) => {
  const option = await getOptionById(optionId);
  Object.assign(option, updateBody);
  await option.save();
  return option;
};

/**
 * Delete option by ID
 * @param {ObjectId} optionId
 * @returns {Promise<Option>}
 */
const deleteOptionById = async (optionId) => {
  const option = await getOptionById(optionId);
  if (!option) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Option not found');
  }
  await option.remove(); // Permanently remove the option
  return option;
};

module.exports = {
  createOption,
  queryOptions,
  getOptionById,
  updateOptionById,
  deleteOptionById,
};
