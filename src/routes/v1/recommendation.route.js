const express = require('express');
const {recommendationController} = require('../../controllers');
const validate = require('../../middlewares/validate');
const {recommendationValidation} = require('../../validations');

const router = express.Router();

// Create a new Recommendation
router.post('/', validate(recommendationValidation.createRecommendation), recommendationController.createRecommendation);

// Get all Recommendations
router.get('/', recommendationController.getRecommendations);

// Get a Recommendation by ID
router.get('/:RecommendationId', recommendationController.getRecommendation);

// Toggle the status of Recommendation
router.patch('/:RecommendationId/status', recommendationController.statusChangeRecommendation); // Use soft delete instead of delete

// Update a Recommendation by ID
router.patch('/:RecommendationId', validate(recommendationValidation.updateRecommendation), recommendationController.updateRecommendation);

module.exports = router;