const httpStatus = require('http-status');
const Question = require('../models/question.model'); // Adjust the path as necessary
const ApiError = require('../utils/ApiError');
const Options = require('../models/options.model');
const mongoose = require('mongoose');

/**
 * Create a question
 * @param {Object} questionBody
 * @returns {Promise<Question>}
 */
const createQuestion = async (questionBody) => {
  return Question.create(questionBody);
};

/**
 * Query for questions
 * @param {Object} filter - MongoDB filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryQuestions = async (filter, options) => {
  options.sort = { createdAt: -1 }; // Default sorting by createdAt descending
  const questions = await Question.paginate(filter, options);
  return questions;
};

/**
 * Get question by id
 * @param {ObjectId} id
 * @returns {Promise<Question>}
 */
const getQuestionById = async (id) => {
  return Question.findById(id);
};

const getQuestionByIdWithOptions = async (questionId) => {
  let question;

  // Ensure questionId is of type ObjectId
  const objectId = mongoose.Types.ObjectId(questionId);

  // Use aggregation pipeline to match question and lookup options
  question = await Question.aggregate([
    {
      $match: {
        _id: objectId, // Match by ObjectId
      },
    },
    {
      $lookup: {
        from: 'options', // The collection to join (use collection name, which is usually the plural form)
        localField: '_id', // Field in Question collection
        foreignField: 'question_id', // Field in Options collection
        as: 'options', // The result will be placed in an 'options' array
      },
    },
  ]);

  // Since aggregation returns an array, get the first result
  if (!question || question.length === 0) {
    return null; // If no question found, return null
  }

  // Return the first element from the array (the question with options)
  return question[0];
};

// In questionService.js
const getDefaultQuestionWithOptions = async () => {
  const question = await Question.aggregate([
    // Match the default question
    {
      $match: {
        default: true,
      },
    },
    // Use $lookup to fetch the related options
    {
      $lookup: {
        from: 'options', // The collection to join (it must be the name of the collection in the DB)
        localField: '_id', // The field from Question model
        foreignField: 'question_id', // The field from Options model that matches
        as: 'options', // The name of the output array field
      },
    },
  ]);

  // Replace with your actual database query logic
  // const question = await Question.findOne({ default: true }).populate('options');

  if (!question) {
    return null; // If no default question found, return null
  }

  return {
    question,
    // options // Only return the value field from options
  };
};

/**
 * Update question by id
 * @param {ObjectId} questionId
 * @param {Object} updateBody
 * @returns {Promise<Question>}
 */
const updateQuestionById = async (questionId, updateBody) => {
  const question = await getQuestionById(questionId);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }
  Object.assign(question, updateBody);
  await question.save();
  return question;
};

/**
 * Delete question by id
 * @param {ObjectId} questionId
 * @returns {Promise<Question>}
 */
const deleteQuestionById = async (questionId) => {
  const question = await getQuestionById(questionId);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }
  await question.remove(); // Hard delete, or you can soft delete by setting a flag
  return question;
};

module.exports = {
  createQuestion,
  queryQuestions,
  getQuestionById,
  updateQuestionById,
  deleteQuestionById,
  getDefaultQuestionWithOptions,
  getQuestionByIdWithOptions,
};
