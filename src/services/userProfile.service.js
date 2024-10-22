const httpStatus = require('http-status');
const {UserProfile} = require('../models');
const  {User}  = require('../models');
// ha iss file ke or shi kro ek bar abhi samne
const ApiError = require('../utils/ApiError');

/**
 * Create a UserProfile
 * @param {Object} userProfileBody - UserProfile data
 * @returns {Promise<UserProfile>}
 */
const createUserProfile = async (userProfileBody) => {
  const userProfile = await UserProfile.create({
    ...userProfileBody,
  });

  return userProfile;
};

/**
 * Query for UserProfiles
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUserProfiles = async (userProfileFilter, options, userFilter) => {
  // Count total user profiles matching the filters
  const totalProfilesCount = await UserProfile.aggregate([
    {
      $lookup: {
        from: 'users', // The name of the user collection
        localField: 'user_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user', // Unwind the user array to get individual user documents
    },
    {
      $match: {
        ...userProfileFilter,
        'user.role': 'user', // Directly check if the user role is 'user'
        ...userFilter, // Apply any additional user filters
      },
    },
    {
      $count: 'total', // Count the total number of user profiles
    },
  ]);

  const totalResults = totalProfilesCount.length > 0 ? totalProfilesCount[0].total : 0;

  // Set pagination options
  const limit = options.limit ? parseInt(options.limit) : 10;
  const page = options.page ? parseInt(options.page) : 1;
  const skip = (page - 1) * limit;

  // Fetch paginated user profiles
  const userProfiles = await UserProfile.aggregate([
    {
      $lookup: {
        from: 'users', // The name of the user collection
        localField: 'user_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $match: {
        ...userProfileFilter,
        'user.role': 'user',
        ...userFilter,
      },
    },
    {
      $project: {
        _id: 1,
        user_id: 1,
        categoryproduct_id: 1,
        image: 1,
        user: {
          name: '$user.name',
          email: '$user.email',
          role: '$user.role',
        },
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  return {
    totalResults,
    userProfiles,
    totalPages: Math.ceil(totalResults / limit),
  };
};

/**
 * Get UserProfile by id
 * @param {ObjectId} id
 * @returns {Promise<UserProfile>}
 */
const getUserProfileById = async (id) => {
    console.log(`\n\n\n\n yaha tk to phoch gya ye bhi to dekhe \n\n\n\n`); // Prints an empty line followed by the userProfile object
  const userProfile = await UserProfile.findById(id).populate('user_id');
  console.log(`\n\n\n\n${JSON.stringify(userProfile, null, 2)}\n\n\n\n`); // Prints an empty line followed by the userProfile object
  if (!userProfile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UserProfile not found');
  }
  return userProfile;
};

/**
 * Update UserProfile by id
 * @param {ObjectId} userProfileId
 * @param {Object} updateBody
 * @returns {Promise<UserProfile>}
 */
const updateUserProfileById = async (userProfileId, updateBody) => {
  const userProfile = await getUserProfileById(userProfileId);
  Object.assign(userProfile, updateBody);
  await userProfile.save();
  return userProfile;
};

/**
 * Delete UserProfile by id
 * @param {ObjectId} userProfileId
 * @returns {Promise<UserProfile>}
 */
const deleteUserProfileById = async (userProfileId) => {
  const userProfile = await getUserProfileById(userProfileId);
  await userProfile.remove();

  // Optionally, remove the associated user if needed
  await User.findByIdAndDelete(userProfile.user_id);

  return userProfile;
};

module.exports = {
  createUserProfile,
  queryUserProfiles,
  getUserProfileById,
  updateUserProfileById,
  deleteUserProfileById,
};
