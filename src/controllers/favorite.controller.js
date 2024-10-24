const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { favoriteService } = require('../services');

/**
 * Create or toggle a favourite (like or dislike)
 */
const createOrToggleFavourite = catchAsync(async (req, res) => {
  const favourite = await favoriteService.createOrToggleFavourite(req); // Pass the full request object

  res.status(httpStatus.CREATED).send({ data: { favourite }, status: true })
});

/**
 * Get all favourites for a user
 */
const getAllFavourites = catchAsync(async (req, res) => {
  console.log(`\n\n\n\n ${req.userId} \n\n\n\n`)
  const userId = req.userId; // Get userId from the token (via auth middleware)
  const result = await favoriteService.getAllFavourites(userId);
  console.log(`\n\n\n\n ${result} \n\n\n\n`)
  res.status(httpStatus.OK).send({ data: { result }, status: true })

});

/**
 * Get favourite by id
 */
const getFavourite = catchAsync(async (req, res) => {
  const favourite = await favoriteService.getFavouriteById(req.params.favouriteId);
  if (!favourite) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Favourite not found');
  }
  res.status(httpStatus.OK).send({ data: { favourite }, status: true })
});

/**
 * Delete a favourite by id
 */
const deleteFavourite = catchAsync(async (req, res) => {
  await favoriteService.deleteFavouriteById(req.params.favouriteId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createOrToggleFavourite,
  getAllFavourites,
  getFavourite,
  deleteFavourite,
};
