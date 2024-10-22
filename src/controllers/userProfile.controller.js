const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const userProfileService = require('../services/userProfile.service');
const userService = require('../services/user.service');

// Create a User Profile
const createUserProfile = catchAsync(async (req, res) => {
  const { categoryproduct_id, name, bio } = req.body; 
  const user_id = req.userId; // Get user_id from the decoded token

  if (!user_id) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Login required');
  }

  // Check if an image file was uploaded
  let image = null;
  if (req.files && req.files.image && req.files.image.length > 0) {
      image = req.files.image[0].filename; // Get the image filename if it exists
  }

  // Check if the user profile already exists
  const existingProfile = await userProfileService.getUserProfileByUserId(user_id);

  if (existingProfile) {
      // If profile exists, update the image and other fields
      const updatedProfileData = {
          name,
          bio,
          ...(categoryproduct_id && { categoryproduct_id }),
      };

      // Explicitly set image to null if no new image is provided
      updatedProfileData.image = image !== null ? image : null;

      const updatedUserProfile = await userProfileService.updateUserProfileByUserId(user_id, updatedProfileData);

      // Also update the user's name in the users table
      const updatedUser = await userService.updateUserNameById(user_id, name);
      if (!updatedUser) {
          throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }

      return res.status(httpStatus.OK).send({
          userProfile: updatedUserProfile,
          updatedUser,
          message: 'User profile updated with new image and name',
      });
  } else {
      // If profile doesn't exist, create a new one
      const newUserProfileData = {
          user_id,
          name,
          image: image || null, // Set to null if no image is provided
          bio,
          ...(categoryproduct_id && { categoryproduct_id }),
      };

      const newUserProfile = await userProfileService.createUserProfile(newUserProfileData);

      // Update the user's name in the users table
      const updatedUser = await userService.updateUserNameById(user_id, name);
      if (!updatedUser) {
          throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }

      return res.status(httpStatus.CREATED).send({
          userProfile: newUserProfile,
          updatedUser,
          message: 'User profile and name created successfully',
      });
  }
});




// Get all User Profiles with pagination and filters
const getUserProfiles = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['user_id', 'categoryproduct_id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  
  if (!options.sortBy) {
    options.sortBy = 'createdAt:desc';
  }

  const result = await userProfileService.queryUserProfiles(filter, options);
  res.send(result);
});

// Get a User Profile by ID
const getUserProfileById = catchAsync(async (req, res) => {
  const user_id = req.userId
  const userProfile = await userProfileService.getUserProfileById(user_id);
  if (!userProfile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Profile not found');
  }
  res.send(userProfile);
});



const deleteUserProfile = catchAsync(async (req, res) => {
  await userProfileService.deleteUserProfileById(req.params.userProfileId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUserProfile,
  getUserProfiles,
  getUserProfileById,

  deleteUserProfile,
};
