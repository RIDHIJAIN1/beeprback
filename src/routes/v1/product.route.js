const express = require('express');
const productController = require('../../controllers/product.controller');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');
const authMiddleware = require('../../middlewares/authMiddleware'); // Assuming you have an auth middleware
const upload = require('../../middlewares/imageUpload');
const auth = require('../../middlewares/auth');
const sellerIsApproved = require('../../middlewares/sellerIsApproved');

const router = express.Router();

// Create a new product
router.post(
  '/', auth('seller'), sellerIsApproved,
  auth('manageProducts'),
 authMiddleware,
  upload.fields([{ name: 'image', maxCount: 1 }]), // Ensure 'image' is correctly defined in your upload middleware
  validate(productValidation.createProduct),
  productController.createProduct
);

// Get all products
router.get(
  '/',
  auth('getProducts'),
  authMiddleware,
  validate(productValidation.getProducts),
  productController.getProducts
);

// Get a product by ID
router.get(
  '/:productId',
  auth('getProducts'),

  validate(productValidation.getProduct),
  productController.getProduct
);

// Update a product by ID
router.patch(
  '/:productId',
  auth('manageProducts'),

  validate(productValidation.updateProduct),
  productController.updateProduct
);

// Delete a product by ID
router.delete(
  '/:productId',
  auth('manageProducts'),

  validate(productValidation.deleteProduct),
  productController.deleteProduct
);

module.exports = router;