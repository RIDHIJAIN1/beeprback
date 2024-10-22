const httpStatus = require('http-status');
const { Favourites } = require('../models'); // Import the Favourites model
const ApiError = require('../utils/ApiError');
const { User } = require('../models');
const { Product } = require('../models');

/**
 * Create a favourite
 * @param {Object} favouriteBody
 * @returns {Promise<Favourites>}
 */
const createFavourite = async (favouriteBody) => {
  const userExists = await User.findById(favouriteBody.user_id);
  const productExists = await Product.findById(favouriteBody.product_id);
  
  if (!userExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  
  if (!productExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  return Favourites.create(favouriteBody);
};

/**
 * Query for favourites
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryFavourites = async (filter, options) => {
  const favourites = await Favourites.paginate(filter, options);
  return favourites;
};

/**
 * Get favourite by id
 * @param {ObjectId} id
 * @returns {Promise<Favourites>}
 */
const getFavouriteById = async (id) => {
  const favourite = await Favourites.findById(id);
  if (!favourite) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Favourite not found');
  }
  return favourite;
};

/**
 * Update favourite by id
 * @param {ObjectId} favouriteId
 * @param {Object} updateBody
 * @returns {Promise<Favourites>}
 */
const updateFavouriteById = async (favouriteId, updateBody) => {
  const favourite = await getFavouriteById(favouriteId);
  
  if (!favourite) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Favourite not found');
  }
  
  Object.assign(favourite, updateBody);
  await favourite.save();
  return favourite;
};

/**
 * Delete favourite by id
 * @param {ObjectId} favouriteId
 * @returns {Promise<Favourites>}
 */
const deleteFavouriteById = async (favouriteId) => {
  const favourite = await getFavouriteById(favouriteId);
  
  if (!favourite) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Favourite not found');
  }
  
  await favourite.remove();
  return favourite;
};

/**
 * Toggle the isLiked status of a favourite
 * @param {ObjectId} favouriteId
 * @returns {Promise<Favourites>}
 */
const toggleFavourite = async (favouriteId) => {
  const favourite = await getFavouriteById(favouriteId);
  
  if (!favourite) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Favourite not found');
  }
  
  // Toggle the isLiked value
  favourite.isLiked = !favourite.isLiked;
  await favourite.save();
  return favourite;
};

/**
 * Count favourites
 * @returns {Promise<number>}
 */
const countFavourites = async () => {
  return Favourites.countDocuments();
};

module.exports = {
  createFavourite,
  queryFavourites,
  getFavouriteById,
  updateFavouriteById,
  deleteFavouriteById,
  toggleFavourite,
  countFavourites,
};