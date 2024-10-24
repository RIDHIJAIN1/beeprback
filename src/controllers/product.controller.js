const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {productService} = require('../services');
const {Recommendation} = require('../models');
const path = require('path');
// Create a new product
const createProduct = catchAsync(async (req, res) => {
  const { image } = req.files; // Assuming image is uploaded via files
  if (!image) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: '"image" is required',
    });
  }

  const { recommendationId } = req.body;

  const recommendation = await Recommendation.findById(recommendationId); // Adjust based on your recommendation model and schema
  if (!recommendation || !recommendation.status) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: 'Product cannot be created because the recommendation is not active.',
    });
  }

  // Prepare the product data for creation
  const productData = {
    image: path.join('uploads', path.basename(image[0].path)), // Assuming image is stored in the path
    title: req.body.title,
    deliveryOption: req.body.deliveryOption,
    unit:req.body.unit,
    price: req.body.price,
    duplicatePrice: req.body.duplicatePrice,
    qty: req.body.qty,
    weight: req.body.weight,
    description: req.body.description,
    recommendationId: req.body.recommendationId,
    categoryId: req.body.categoryId,
    sellerId: req.userId, 
    // Ensure this is set from the token
    // reviews: req.body.reviews || [], // Optional reviews
  };

  const product = await productService.createProduct(productData);
  res.status(httpStatus.CREATED).send(product);
});

// Get all products
const getProducts = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.title) {
    filter.title = { $regex: req.query.title, $options: 'i' }; // Case-insensitive search
  }
  if (req.query.recommendation) {
    filter.recommendation = req.query.recommendation;
  }

  if (req.query.id) {
    filter._id = req.query.id; // MongoDB uses `_id` for document IDs
  }
  if (req.query.sellerId) {
    filter.sellerId = req.query.sellerId;
  }

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  if (!options.sortBy) {
    options.sortBy = 'createdAt:desc';
  }
  const products = await productService.queryProducts(filter, options);
  res.status(httpStatus.OK).send({ data: { products }, status: true , message: "Products fetched successfully"})
 
});

// Get a product by ID
// Get a product by productId or sellerId
const getProduct = catchAsync(async (req, res) => {
  const { productId, sellerId , categoryId} = req.query;

  let product;
  if (productId) {
    product = await productService.getProductById(productId); // Query by productId
  } else if (sellerId) {
    product = await productService.getProductsBySellerId(sellerId); // Query by sellerId
  
  } else if (categoryId) {
    product = await productService.getProductsByCategoryId(categoryId); // Query by sellerId
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Either productId or sellerId is required');
  }

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  res.status(httpStatus.OK).send({ data: { product }, status: true })

});



// Update a product by ID
const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(req.params.productId, req.body);
  res.send(product);
});

// Delete a product by ID
const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
