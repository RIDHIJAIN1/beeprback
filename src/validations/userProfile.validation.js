const Joi = require('joi');
const { objectId } = require('./custom.validation');

// Validation for creating a UserProfile
const createUserProfile = {
  body: Joi.object().keys({
    user_id: Joi.string().custom(objectId).required(), // Assuming user_id is an ObjectId
    categoryproduct_id: Joi.string().custom(objectId).optional(), // Assuming categoryproduct_id is an ObjectId
    image: Joi.string().optional(), // Image URL or path as string
    bio: Joi.string().optional(), // Image URL or path as string
  }),
};

// Validation for getting UserProfiles (query params)
const getUserProfiles = {
  query: Joi.object().keys({
    sortBy: Joi.string().valid('createdAt', '-createdAt'), // Sorting by date
    limit: Joi.number().integer(), // Limiting the number of results
    page: Joi.number().integer(), // Pagination page number
    userId: Joi.string().hex().length(24), // userId as a 24-char hexadecimal string
  }),
};

// Validation for getting a single UserProfile by id
const getUserProfile = {
  params: Joi.object().keys({
    userProfileId: Joi.string().custom(objectId), // Ensure it's a valid ObjectId
  }),
};

// Validation for updating a UserProfile
const updateUserProfileById = {
  body: Joi.object().keys({
    user_id: Joi.string().custom(objectId).optional(), // Can be optional during an update
    categoryproduct_id: Joi.string().custom(objectId).optional(),
    image: Joi.string().optional(), // Optional if the image is not being updated
    bio: Joi.string().optional(), // Optional if the image is not being updated
  }),
};

// Validation for deleting a UserProfile by id
const deleteUserProfile = {
  params: Joi.object().keys({
    userProfileId: Joi.string().custom(objectId), // Ensure it's a valid ObjectId
  }),
};

module.exports = {
  createUserProfile,
  getUserProfiles,
  getUserProfile,
  updateUserProfileById,
  deleteUserProfile,
};
