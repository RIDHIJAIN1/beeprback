const httpStatus = require('http-status');
const  Seller  = require('../models/seller.model');
const { User } = require('../models/user.model');
const ApiError = require('../utils/ApiError');

/**
 * Create a seller
 * @param {Object} sellerBody - Seller data including responsible managing party, licenses, billing address, and payment option
 * @returns {Promise<Seller>}
 */
const createSeller = async (sellerBody) => {
  if (!Seller) {
    throw new Error('Seller model is not defined');
  }
  const seller = await Seller.create({
    ...sellerBody,
  });

  return seller;
};

/**
 * Query for sellers
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySellers = async (sellerFilter, options, userFilter) => {
  // Use aggregate to join sellers and users
  const sellers = await Seller.aggregate([
    {
      $lookup: {
        from: 'users', // The name of the user collection
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user', // Unwind the user array to get individual user documents
    },
    {
      $match: {
        ...sellerFilter,
        ...userFilter, // Apply user filters here
      },
    },
    {
      $project: {
        // Select the fields you want to return
        _id: 1,
        photoId: 1,
        cannabisLicense: 1,
        resellersPermit: 1,
        street: 1,
        state: 1,
        zipCode: 1,
        city: 1,
        paymentOption: 1,
        isApproved: 1,
        user: {
          name: '$user.name',
          role: '$user.role',
          email: '$user.email',
        },
      },
    },
    // Check if options.sortBy is provided and valid

  ]);
  return sellers;
};

/**
 * Get seller by id
 * @param {ObjectId} id
 * @returns {Promise<Seller>}
 */
const getSellerById = async (id) => {
  const seller = await Seller.findById(id).populate('userId');
  if (!seller) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found');
  }
  return seller;
};

/**
 * Update seller by id
 * @param {ObjectId} sellerId
 * @param {Object} updateBody
 * @returns {Promise<Seller>}
 */
const updateSellerById = async (sellerId, updateBody) => {
  const seller = await getSellerById(sellerId);
  Object.assign(seller, updateBody);
  await seller.save();
  return seller;
};

/**
 * Delete seller by id
 * @param {ObjectId} sellerId
 * @returns {Promise<Seller>}
 */
const deleteSellerById = async (sellerId) => {
  const seller = await getSellerById(sellerId);
  await seller.remove();
  
  // Optionally, remove the associated user
  await User.findByIdAndDelete(seller.userId);

  return seller;
};

/**
 * Approve seller by id
 * @param {ObjectId} sellerId
 * @returns {Promise<Seller>}
 */
const approveSellerById = async (sellerId) => {
  const seller = await getSellerById(sellerId);
  if (!seller) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found');
  }
  
  // Set the seller's approval status to true
  seller.isApproved = true;
  await seller.save();
  
  return seller;
};

module.exports = {
  createSeller,
  querySellers,
  getSellerById,
  updateSellerById,
  deleteSellerById,
  approveSellerById,
};