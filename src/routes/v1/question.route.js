const express = require('express');
const questionController = require('../../controllers/question.controller');
const auth = require('../../middlewares/auth');
// const categoryValidation = require('../../validations/category.validation');

const router = express.Router();

// Create a new category
router.post('/', questionController.createQuestion);

// Get all categories
router.get('/', questionController.getQuestion);

router.get('/user/:questionId?', questionController.getQuestionWithOption);
// Get a category by ID
router.get('/:questionId', questionController.getQuestionById);
// router.get('/user', questionController.getQuestionWithOption);



// Update a category by ID
router.patch('/:questionId', questionController.updateQuestion);
router.delete('/:questionId', questionController.deleteQuestion);

module.exports = router;