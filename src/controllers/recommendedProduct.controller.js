const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {recommendedProductService} = require('../services');

/**
 * Create a new RecommendedProduct
 */
const createRecommendedProduct = catchAsync(async (req, res) => {
  // Collect validated data from the request body
  const recommendedProductData = {
    recommendationId: req.body.recommendationId, // Match schema field name
    productId: req.body.productId, 
  };

  // Call the service layer to create the RecommendedProduct entry
  const recommendedProduct = await recommendedProductService.createRecommendedProduct(recommendedProductData);

  // Return the created entry with status 201
  res.status(httpStatus.CREATED).send(recommendedProduct);
});

/**
 * Get all RecommendedProduct with filtering and pagination
 */
const getRecommendedProducts = catchAsync(async (req, res) => {
  // Pick filter criteria from the request query (like recommendationId or productId)
  const filter = pick(req.query, ['category_id', 'product_id']);

  // Pick options like sortBy, limit, and page for pagination
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  if (!options.sortBy) {
    options.sortBy = 'createdAt:desc'; // Default sorting by creation date (desc)
  }

  // Call the service layer to get the list of RecommendedProduct entries
  const recommendedProductList = await recommendedProductService.queryRecommendedProducts(filter, options);

  // Send the list of entries as the response
  res.send({ data: recommendedProductList });
});

/**
 * Get a single RecommendedProduct by ID
 */
const getRecommendedProduct = catchAsync(async (req, res) => {
  // Extract the RecommendedProduct ID from request params
  const { recommendedProductId } = req.params;

  // Call the service layer to fetch the RecommendedProduct by ID
  const{ recommendedProduct , product} = await recommendedProductService.getRecommendedProductById(recommendedProductId);
  
  // If the entry is not found, throw a 404 error
  if (!recommendedProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, 'RecommendedProduct not found');
  }

  // Return the found entry
  res.status(httpStatus.OK).send({ data: { category: recommendedProduct , product:product }, status: true })
});

/**
 * Update a RecommendedProduct by ID
 */
const updateRecommendedProduct = catchAsync(async (req, res) => {
    const { recommendedProductId } = req.params; // Make sure this matches what you are using in the route
    const updateBody = req.body;
  
    // Call the service layer to update the RecommendedProduct by ID with the provided data
    const recommendedProduct = await recommendedProductService.updateRecommendedProductById(recommendedProductId, updateBody);
  
    // Send the updated entry as the response
    res.send(recommendedProduct);
  });
  

/**
 * Delete a RecommendedProduct by ID
 */
const deleteRecommendedProduct = catchAsync(async (req, res) => {
  // Call the service layer to delete the RecommendedProduct by ID
  await recommendedProductService.deleteRecommendedProductById(req.params.recommendedProductId);

  // Respond with 204 No Content after successful deletion
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createRecommendedProduct,
  getRecommendedProducts,
  getRecommendedProduct,
  updateRecommendedProduct,
  deleteRecommendedProduct,
};
