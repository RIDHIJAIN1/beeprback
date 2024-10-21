const express = require('express');
const reviewController = require('../../controllers/review.controller');
const auth = require('../../middlewares/auth');
const reviewValidation = require('../../validations');
const validate = require('../../middlewares/validate');

const router = express.Router();

// Create a new category
router.post('/',validate(reviewValidation.createReview), reviewController.createReview);

// Get all categories
router.get('/',validate(reviewValidation.getReviews), reviewController.getReviews);

router.get('/:reviewId?',validate(reviewValidation.getReview), reviewController.getReview);




// Update a category by ID
router.patch('/:reviewId',validate(reviewValidation.updateReview), reviewController.updateReview);
router.delete('/:reviewId', validate(reviewValidation.deleteReview),reviewController.deleteReview);

module.exports = router;