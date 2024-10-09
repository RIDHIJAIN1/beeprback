const express = require('express');
const optionController = require('../../controllers/options.controller');
const validate = require('../../middlewares/validate');
const optionValidation = require('../../validations/option.validation');
const authMiddleware = require('../../middlewares/authMiddleware'); // Assuming you have this middleware
const auth = require('../../middlewares/auth');


const router = express.Router();

// Create a new option
router.post(
  '/',
  auth('manageOptions'),         
  validate(optionValidation.createOption), // Validate the input data for creating an option
  optionController.createOption  // Controller to handle option creation
);

// Get all options
router.get(
  '/',
  auth('getOptions'),           // Permission to fetch options
  authMiddleware,               // Middleware for authentication
  validate(optionValidation.getOptions),  // Validation for query params
  optionController.getOptions   // Controller to fetch all options
);

// Get an option by ID
router.get(
  '/:optionId',
  auth('getOptions'),           // Permission to fetch a specific option
  validate(optionValidation.getOption), // Validate the input for fetching an option by ID
  optionController.getOption    // Controller to fetch option by ID
);

// Update an option by ID
router.patch(
  '/:optionId',
  auth('manageOptions'),         // Permission to update an option
             // Ensure seller is approved
  validate(optionValidation.updateOption),  // Validation for updating an option
  optionController.updateOption  // Controller to handle option update
);

// Delete an option by ID
router.delete(
  '/:optionId',
  auth('manageOptions'),         // Permission to delete an option
  validate(optionValidation.deleteOption),  // Validation for deleting an option by ID
  optionController.deleteOption  // Controller to handle option deletion
);

module.exports = router;
