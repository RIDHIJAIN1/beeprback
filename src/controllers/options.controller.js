const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const optionService = require('../services/option.service');

/**
 * Create a new option
 */
const createOption = catchAsync(async (req, res) => {
  // Collect validated data from the request body
  const optionData = {
    question_id: req.body.question_id,
    type: req.body.type,
    value: req.body.value,
    next_question_id: req.body.next_question_id || null, // Only include if type is 'next_question'
    category_id: req.body.category_id || null,           // Only include if type is 'product_category'
       
  };

  // Call the option service to create the option
  const option = await optionService.createOption(optionData);

  // Send back the created option in the response
  res.status(httpStatus.CREATED).send(option);
});
/**
 * Get all options
 */
const getOptions = catchAsync(async (req, res) => {
  const filter = {};

  if (req.query.name) {
    filter.name = { $regex: req.query.name, $options: 'i' }; // Case-insensitive search
  }
  if (req.query.productId) {
    filter.productId = req.query.productId;
  }
  if (req.query.sellerId) {
    filter.sellerId = req.query.sellerId;
  }

  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  if (!options.sortBy) {
    options.sortBy = 'createdAt:desc';
  }

  const optionList = await optionService.queryOptions(filter, options);
  res.send({data:optionList});
});

/**
 * Get an option by ID
 */
const getOption = catchAsync(async (req, res) => {
  const { optionId } = req.params;

  const option = await optionService.getOptionById(optionId);
  if (!option) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Option not found');
  }

  res.send(option);
});

/**
 * Update an option by ID
 */
const updateOption = catchAsync(async (req, res) => {
  const option = await optionService.updateOptionById(req.params.optionId, req.body);
  res.send(option);
});

/**
 * Delete an option by ID
 */
const deleteOption = catchAsync(async (req, res) => {
  await optionService.deleteOptionById(req.params.optionId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createOption,
  getOptions,
  getOption,
  updateOption,
  deleteOption,
};
