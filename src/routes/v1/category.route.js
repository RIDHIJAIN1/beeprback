const express = require('express');
const {categoryController }= require('../../controllers');
const validate = require('../../middlewares/validate');
const {categoryValidation }= require('../../validations');

const router = express.Router();

// Create a new category
router.post('/', validate(categoryValidation.createCategory), categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getCategories);

// Get a category by ID
router.get('/:categoryId', categoryController.getCategory);

// Toggle the status of category
router.patch('/:categoryId/status', categoryController.statusChangeCategory); // Use soft delete instead of delete

// Update a category by ID
router.patch('/:categoryId', validate(categoryValidation.updateCategory), categoryController.updateCategory);

module.exports = router;