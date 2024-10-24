const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {recommendationService} = require('../services');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');

// Create a new Recommendation
const createRecommendation = catchAsync(async (req, res) => {
  const recommendation = await recommendationService.createRecommendation(req.body);
  res.status(httpStatus.CREATED).send(recommendation);
});

// Get all categories
const getRecommendations = catchAsync(async (req, res) => {
  const filter = {}
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

    if (req.query.id) {
    filter._id = req.query.id; // MongoDB uses `_id` for document IDs
  }

  if (!options.sortBy) {
    options.sortBy = 'createdAt:desc';
  }
  const categories = await recommendationService.queryRecommendation(filter,options);
  res.send(categories);
});

// Get Recommendation by ID
const getRecommendation = catchAsync(async (req, res) => {
  const recommendation = await recommendationService.getRecommendationById(req.params.RecommendationId);
  if (!recommendation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Recommendation not found');
  }
  res.send(recommendation);
});

// Update a Recommendation by ID
const updateRecommendation = catchAsync(async (req, res) => {
  const recommendation = await recommendationService.updateRecommendationById(req.params.RecommendationId, req.body);
  res.send(recommendation);
});

// Toggle Recommendation status
const statusChangeRecommendation = catchAsync(async (req, res) => {
  await recommendationService.statusChangeById(req.params.RecommendationId);
  res.status(httpStatus.OK).send({message:"Status changed successfully!"});
});

module.exports = {
  createRecommendation,
  getRecommendation,
  getRecommendations,
  updateRecommendation,
  statusChangeRecommendation, // Export the soft delete function
};