const httpStatus = require('http-status');
const  Seller  = require('../models/seller.model');
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
    // Optionally include sorting and pagination logic here
  ]);

  return sellers;
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
  const seller = await getSellerById(sellerId);

  if (!seller) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found');
  }
    seller.isApproved = true;
    await seller.save();

   
  

  return seller;

};

const disapproveSellerById = async (sellerId, adminMessage) => {
  const seller = await getSellerById(sellerId);
  if (!seller) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found');
  }

  if(!adminMessage){
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }
  
  // Disapprove the seller
  seller.isApproved = false;
  await seller.save();
  
  // Send the disapproval message to the seller
  await sendMessageToSeller(sellerId, adminMessage);
  
  return seller;
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
  getSellerByUserId
};