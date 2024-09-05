const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const productService = require('../services/product.service');

// Create a new product
const createProduct = catchAsync(async (req, res) => {
  const { image } = req.files; // Assuming image is uploaded via files
  if (!image) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: '"image" is required',
    });
  }

  // Prepare the product data for creation
  const productData = {
    image: image[0].path, // Assuming image is stored in the path
    title: req.body.title,
    deliveryOption: req.body.deliveryOption,
    weight: req.body.weight,
    description: req.body.description,
    categoryId: req.body.categoryId,
    sellerId: req.userId, // Ensure this is set from the token
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
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.sellerId) {
    filter.sellerId = req.query.sellerId;
  }

  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const products = await productService.queryProducts(filter, options);
  res.send(products);
});

// Get a product by ID
const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  res.send(product);
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
