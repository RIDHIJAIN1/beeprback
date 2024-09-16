const httpStatus = require('http-status');
const  Seller  = require('../models/seller.model');
const  Product = require('../models/product.model');
const { User } = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const Message = require('../models/message.model')

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
  // Count total sellers matching the filters
  const totalSellersCount = await Seller.aggregate([
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
        'user.role': 'seller', // Directly check if the user role is 'seller'
        ...userFilter, // Apply any additional user filters
      },
    },
    {
      $count: 'total', // Count the total number of sellers
    },
  ]);

  const totalResults = totalSellersCount.length > 0 ? totalSellersCount[0].total : 0; // Get total count

  // Set pagination options
  const limit = options.limit ? parseInt(options.limit) : 10; // Default limit
  const page = options.page ? parseInt(options.page) : 1; // Default page
  const skip = (page - 1) * limit; // Calculate skip value

  // Fetch paginated sellers
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
        'user.role': 'seller', // Directly check if the user role is 'seller'
        ...userFilter, // Apply any additional user filters
      },
    },
    {
      $project: {
        // Specify the fields to return
        _id: 1,
        isApproved: 1,
        photoId: 1,
        cannabisLicense: 1,
        resellersPermit: 1,
        street: 1,
        city: 1,
        state: 1,
        zipCode: 1,
        paymentOption: 1,
        user: {
          name: '$user.name',
          role: '$user.role',
          email: '$user.email',
        },
      },
    },
    {
      $sort: { createdAt: -1 }, // Sort sellers by createdAt descending
    },
    {
      $skip: skip, // Skip the calculated number of documents
    },
    {
      $limit: limit, // Limit the results
    },
  ]);

  // Return the total count and the sellers
  return {
    totalResults,
    sellers,
    totalPages: Math.ceil(totalResults / limit), // Calculate total pages
  };
};


/**
 * Get seller by id
 * @param {ObjectId} id
 * @returns {Promise<Seller>}
 */
const getSellerByUserId = async (userId) => {
  const seller = await Seller.findOne({userId});
  if (!seller) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found');
  }
  return seller;
};
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
  const seller = await Seller.findById(sellerId);

  if (!seller) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found');
  }

  // Check current approval status
  if (seller.isApproved === 'approved') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Seller is already approved');
  }

  // Update the approval status
  seller.isApproved = 'approved';
  await seller.save();

  return seller;
};

const disapproveSellerById = async (sellerId, adminMessage) => {
  const seller = await getSellerById(sellerId);
  if (!seller) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found');
  }

  if(!adminMessage){
    throw new ApiError(httpStatus.BAD_REQUEST, 'Message not found');
  }
  
  if (seller.isApproved === 'rejected') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Seller is already rejected');
  }

  // Update the approval status
  seller.isApproved = 'rejected';
  await seller.save();
  // Send the disapproval message to the seller
  await sendMessageToSeller(sellerId, adminMessage);
  
  return seller;
};

const countProductsBySeller = async (sellerId) => {
  if (!sellerId) {
    throw new Error('Seller ID is not provided');
  }

  try {
    return await Product.countDocuments({ sellerId });
  } catch (error) {
    throw new Error(`Error counting products for seller ${sellerId}: ${error.message}`);
  }
};




const sendMessageToSeller = async (sellerId, message) => {
  const seller = await getSellerById(sellerId);
  
  if (!seller) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found');
  }

  // Store the message in the database
  const newMessage = new Message({
    sellerId: seller._id,// The admin sending the message
    message,
  });

  await newMessage.save();
  console.log(`Message stored in DB for seller (${seller._id}): ${message}`);
};



module.exports = {
  createSeller,
  querySellers,
  getSellerById,
  updateSellerById,
  deleteSellerById,
  approveSellerById,
  disapproveSellerById,
  sendMessageToSeller,
  getSellerByUserId,
  countProductsBySeller
};