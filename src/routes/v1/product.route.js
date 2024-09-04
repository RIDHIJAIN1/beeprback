const express = require('express');
const productController = require('../../controllers/product.controller');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');
const authMiddleware = require('../../middlewares/authMiddleware'); // Assuming you have an auth middleware
const upload = require('../../middlewares/imageUpload');

const router = express.Router();

// Create a new product
router.post(
  '/',
 authMiddleware,
  upload.fields([{ name: 'image', maxCount: 1 }]), // Ensure 'image' is correctly defined in your upload middleware
  validate(productValidation.createProduct),
  productController.createProduct
);

// Get all products
router.get(
  '/',
  authMiddleware,
  validate(productValidation.getProducts),
  productController.getProducts
);

// Get a product by ID
router.get(
  '/:productId',
  authMiddleware,
  validate(productValidation.getProduct),
  productController.getProduct
);

// Update a product by ID
router.patch(
  '/:productId',
  authMiddleware,
  validate(productValidation.updateProduct),
  productController.updateProduct
);

// Delete a product by ID
router.delete(
  '/:productId',
  authMiddleware,
  validate(productValidation.deleteProduct),
  productController.deleteProduct
);

module.exports = router;