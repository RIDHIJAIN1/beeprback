const express = require('express');
const categoryController = require('../../controllers/category.controller');
const validate = require('../../middlewares/validate');
const categoryValidation = require('../../validations/category.validation');

const router = express.Router();

// Create a new category
router.post('/', validate(categoryValidation.createCategory), categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getCategories);

// Get a category by ID
router.get('/:categoryId', categoryController.getCategory);

// Update a category by ID
router.patch('/:categoryId', validate(categoryValidation.updateCategory), categoryController.updateCategory);

// Soft delete a category by ID
router.patch('/:categoryId/status', categoryController.statusChangeCategory); // Use soft delete instead of delete

module.exports = router;