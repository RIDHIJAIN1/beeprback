const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { favouriteService } = require('../services');

const createFavourite = catchAsync(async (req, res) => {
  const favourite = await favouriteService.createFavourite(req.body);
  res.status(httpStatus.CREATED).send(favourite);
});

const getFavourites = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['user_id', 'product_id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  if (!options.sortBy) {
    options.sortBy = 'createdAt:desc'; // Default sorting
  }
  const result = await favouriteService.queryFavourites(filter, options);
  res.send(result);
});

const getFavourite = catchAsync(async (req, res) => {
  const favourite = await favouriteService.getFavouriteById(req.params.favouriteId);
  if (!favourite) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Favourite not found');
  }
  res.send(favourite);
});

const updateFavourite = catchAsync(async (req, res) => {
  const favourite = await favouriteService.updateFavouriteById(req.params.favouriteId, req.body);
  res.send(favourite);
});

const deleteFavourite = catchAsync(async (req, res) => {
  await favouriteService.deleteFavouriteById(req.params.favouriteId);
  res.status(httpStatus.NO_CONTENT).send();
});

const toggleFavouriteStatus = catchAsync(async (req, res) => {
  const favourite = await favouriteService.toggleFavourite(req.params.favouriteId);
  res.send(favourite);
});

const countFavourites = catchAsync(async (req, res) => {
  const favouriteCount = await favouriteService.countFavourites();
  res.status(httpStatus.OK).json({ favouriteCount });
});

module.exports = {
  createFavourite,
  getFavourites,
  getFavourite,
  updateFavourite,
  deleteFavourite,
  toggleFavouriteStatus,
  countFavourites,
};