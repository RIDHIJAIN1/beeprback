const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const userProfileService = require('../services/userProfile.service');

// Create a User Profile
const createUserProfile = catchAsync(async (req, res) => {
    const { user_id, categoryproduct_id } = req.body;
  
    // Log req.files to see if the image is being uploaded
    console.log(req.files);
  
    // Check if image is present in req.files
    if (!user_id || !req.files || !req.files.image) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'user_id and image are required');
    }
  
    const image = req.files.image[0].filename; // Multer saves the file info in an array
  
    const userProfileData = {
      user_id,
      image,
      ...(categoryproduct_id && { categoryproduct_id }),
    };
  
    const userProfile = await userProfileService.createUserProfile(userProfileData);
    res.status(httpStatus.CREATED).send(userProfile);
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
  const userProfile = await userProfileService.getUserProfileById(req.params.userProfileId);
  if (!userProfile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Profile not found');
  }
  res.send(userProfile);
});

// Update a User Profile by ID
const updateUserProfile = catchAsync(async (req, res) => {
  const userProfile = await userProfileService.updateUserProfileById(req.params.userProfileId, req.body);
  if (!userProfile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Profile not found');
  }
  res.send(userProfile);
});

// Delete a User Profile by ID
const deleteUserProfile = catchAsync(async (req, res) => {
  await userProfileService.deleteUserProfileById(req.params.userProfileId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUserProfile,
  getUserProfiles,
  getUserProfileById,
  updateUserProfile,
  deleteUserProfile,
};
