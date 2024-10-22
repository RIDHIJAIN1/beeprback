const express = require('express');
const categoryHaveProductController = require('../../controllers/categoryHaveProduct.controller');
const validate = require('../../middlewares/validate');
const categoryHaveProductValidation = require('../../validations/categoryHaveProduct.validation');
const auth = require('../../middlewares/auth');

const router = express.Router();

// Create a new CategoryHaveProduct
router.post(
  '/',
  auth('manageCategories'),     // Permission to manage categories
  validate(categoryHaveProductValidation.createCategoryProduct), // Validate input for creating CategoryHaveProduct
  categoryHaveProductController.createCategoryHaveProduct  // Controller to handle creation
);

// Get all CategoryHaveProduct entries
router.get(
  '/',
  auth('getCategories'),        // Permission to fetch categories
  validate(categoryHaveProductValidation.getCategoryProducts),  // Validation for query parameters
  categoryHaveProductController.getCategoryHaveProducts  // Controller to fetch all entries
);

// Get a CategoryHaveProduct entry by ID
router.get(
  '/:categoryProductId',
      // Permission to fetch a specific CategoryHaveProduct
  validate(categoryHaveProductValidation.getCategoryProduct), // Validate the input for fetching by ID
  categoryHaveProductController.getCategoryHaveProduct    // Controller to handle fetching by ID
);

// Update a CategoryHaveProduct entry by ID
router.patch(
  '/:categoryProductId',
  auth('manageCategories'),     // Permission to update a CategoryHaveProduct entry
  validate(categoryHaveProductValidation.updateCategoryProduct),  // Validation for updating
  categoryHaveProductController.updateCategoryHaveProduct  // Controller to handle update
);

// Delete a CategoryHaveProduct entry by ID
router.delete(
  '/:categoryProductId',
  auth('manageCategories'),     // Permission to delete a CategoryHaveProduct entry
  validate(categoryHaveProductValidation.deleteCategoryProduct),  // Validation for deleting
  categoryHaveProductController.deleteCategoryHaveProduct  // Controller to handle deletion
);

module.exports = router;
