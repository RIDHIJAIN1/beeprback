const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { reviewService } = require('../services');

const createReview = catchAsync(async (req, res) => {
  const review = await reviewService.createReview(req.body);
  res.status(httpStatus.CREATED).send(review);
});

const getReviews = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['user_id', 'product_id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  
  if (!options.sortBy) {
    options.sortBy = 'createdAt:desc';
  }
  
  const result = await reviewService.queryReviews(filter, options);
  res.send(result);
});

const getReview = catchAsync(async (req, res) => {
  const review = await reviewService.getReviewById(req.params.reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  res.send(review);
});

const updateReview = catchAsync(async (req, res) => {
  const review = await reviewService.updateReviewById(req.params.reviewId, req.body);
  res.send(review);
});

const deleteReview = catchAsync(async (req, res) => {
  await reviewService.deleteReviewById(req.params.reviewId);
  res.status(httpStatus.NO_CONTENT).send();
});

const countReviews = catchAsync(async (req, res) => {
  const reviewCount = await reviewService.countReviews();
  res.status(httpStatus.OK).json({ reviewCount });
});

module.exports = {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  countReviews,
};
