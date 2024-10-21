const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const questionService = require('../services/question.service');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');

// Create a new category
const createQuestion = catchAsync(async (req, res) => {
  const question = await questionService.createQuestion(req.body);
  res.status(httpStatus.CREATED).send(question);
});

// Get all categories
const getQuestion = catchAsync(async (req, res) => {
  const filter = {}
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

    if (req.query.id) {
    filter._id = req.query.id; // MongoDB uses `_id` for document IDs
  }

  if (!options.sortBy) {
    options.sortBy = 'createdAt:desc';
  }
  const questions = await questionService.queryQuestions(filter,options);
  res.send({
    
    data:questions});
});

const getQuestionWithOption = catchAsync(async (req, res) => {
  const questionId = req.params.questionId || null;  // Use null if no questionId is provided
  let question;

  if (!questionId) {
    question = await questionService.getDefaultQuestionWithOptions();

  } else {
    question = await questionService.getQuestionByIdWithOptions(questionId);

  }

  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }

  res.send({
    data: question  // Send back the question and its options
  });
});

// Get category by ID
const getQuestionById = catchAsync(async (req, res) => {
  const question = await questionService.getQuestionById(req.params.questionId);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'question not found');
  }
  res.send({
    
    data:question});
});
// const getQuestionWithOption = catchAsync(async (req, res) => {
//   const questionId = req.params.questionId || null;  // Use null if no questionId is provided

//   const question = await questionService.getQuestionByIdWithOptions(questionId);
  
//   if (!question) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
//   }

//   res.send({
//     data: question  // Send back the question and its options
//   });
// });


// Update a category by ID
const updateQuestion = catchAsync(async (req, res) => {
    const question = await questionService.updateQuestionById(req.params.questionId, req.body);
    if (!question) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
    }
    res.send({
        data:question});
  });
// Delete (or soft delete) a question by ID
const deleteQuestion = catchAsync(async (req, res) => {
    const question = await questionService.deleteQuestionById(req.params.questionId);
    if (!question) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
    }
    res.status(httpStatus.NO_CONTENT).send();
  });
  

module.exports = {
    createQuestion,
    getQuestionById,
    getQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestionWithOption
};