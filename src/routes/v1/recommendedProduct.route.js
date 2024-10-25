const express = require('express');
const {recommendedProductController} = require('../../controllers');
const validate = require('../../middlewares/validate');
const {recommendedProductValidation} = require('../../validations');
const auth = require('../../middlewares/auth');

const router = express.Router();

// Create a new CategoryHaveProduct
router.post(
  '/',
  auth('manageCategories'),     // Permission to manage categories
  validate(recommendedProductValidation.createRecommendedProduct), // Validate input for creating CategoryHaveProduct
  recommendedProductController.createRecommendedProduct  // Controller to handle creation
);

// Get all CategoryHaveProduct entries
router.get(
  '/',
  auth('getCategories'),        // Permission to fetch categories
  validate(recommendedProductValidation.getRecommendedProducts),  // Validation for query parameters
  recommendedProductController.getRecommendedProducts  // Controller to fetch all entries
);

// Get a CategoryHaveProduct entry by ID
router.get(
  '/:recommendedProductId',
      // Permission to fetch a specific CategoryHaveProduct
  validate(recommendedProductValidation.getRecommendedProduct), // Validate the input for fetching by ID
  recommendedProductController.getRecommendedProduct    // Controller to handle fetching by ID
);

// Update a CategoryHaveProduct entry by ID
router.patch(
  '/:recommendedProductId',
  auth('manageCategories'),     // Permission to update a CategoryHaveProduct entry
  validate(recommendedProductValidation.updateRecommendedProduct),  // Validation for updating
  recommendedProductController.updateRecommendedProduct  // Controller to handle update
);

// Delete a CategoryHaveProduct entry by ID
router.delete(
  '/:recommendedProductId',
  auth('manageCategories'),     // Permission to delete a CategoryHaveProduct entry
  validate(recommendedProductValidation.deleteRecommendedProduct),  // Validation for deleting
  recommendedProductController.deleteRecommendedProduct  // Controller to handle deletion
);

module.exports = router;
