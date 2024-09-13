const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const  sellerService  = require('../services/seller.service');
const path = require('path');
const Message = require('../models/message.model');

// Create a new seller
const createSeller = catchAsync(async (req, res) => {
  const { photoId, cannabisLicense, resellersPermit } = req.files;
  
  if (!photoId || !cannabisLicense || !resellersPermit) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: '"photoId", "cannabisLicense", and "resellersPermit" are required',
    });
  }

  // Prepare the seller data for creation
  const sellerData = {
    userId: req.user._id, // Ensure this is set from the token

    photoId: path.join('uploads', path.basename(photoId[0].path)),
    cannabisLicense: path.join('uploads', path.basename(cannabisLicense[0].path)),
    resellersPermit: path.join('uploads', path.basename(resellersPermit[0].path)),
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    zipCode: req.body.zipCode,
    country: req.body.country,
    paymentOption: req.body.paymentOption,
    billingAddress: req.body.billingAddress,
  };

  const seller = await sellerService.createSeller(sellerData);
  res.status(httpStatus.CREATED).send(seller);
});

const getProductCountBySeller = catchAsync(async (req, res) => {
  const { sellerId } = req.params; // Assuming sellerId is passed as a route parameter

  try {
    if (!sellerId) {
      throw new Error('Seller ID is required');
    }

    const productCount = await sellerService.countProductsBySeller(sellerId);
    res.status(200).send({ sellerId, productCount });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});



// Get all sellers
const getSellers = catchAsync(async (req, res) => {
  const userFilter = {};
  // Set the role to 'seller' to only retrieve sellers
  

  if (req.query.name) {
    userFilter.name = { $regex: req.query.name, $options: 'i' }; // Case-insensitive search
  }

  const sellerFilter = {}; // You can add other seller-specific filters here
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

    if (!options.sortBy) {
    options.sortBy = 'createdAt:desc';
  }
  
  const sellers = await sellerService.querySellers(sellerFilter, options, userFilter);
  res.send(sellers);
});

// Get a seller by ID
const getSeller = catchAsync(async (req, res) => {
  const seller = await sellerService.getSellerById(req.params.sellerId);
  if (!seller) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found');
  }
  res.send(seller);
});

// Update a seller by ID
const updateSeller = catchAsync(async (req, res) => {
  const seller = await sellerService.updateSellerById(req.params.sellerId, req.body);
  res.send(seller);
});

// Delete a seller by ID
const deleteSeller = catchAsync(async (req, res) => {
  await sellerService.deleteSellerById(req.params.sellerId);
  res.status(httpStatus.NO_CONTENT).send();
});

// Approve a seller by ID
const disapproveSeller = async (req, res) => {
  const { sellerId } = req.params;
  const { message } = req.body; // New message from admin

  if (!message) {
    return res.status(400).json({ status: 'error', message: 'Message is required' });
  }

  if (!sellerId) {
    return res.status(400).json({ status: 'error', message: 'sellerId is required' });
  }

  const currentSeller = await sellerService.getSellerById(sellerId);

  if (!currentSeller) {
    return res.status(404).json({ status: 'error', message: 'Seller not found' });
  }

  // Check if the seller is already disapproved
  if (currentSeller.isApproved !== 'rejected') {
    return res.status(400).json({ status: 'error', message: 'Seller is not disapproved yet' });
  }

  // Update the disapproval message
  currentSeller.message = message; // Update the message with the new one
  const updatedSeller = await currentSeller.save(); // Save the updated seller information

  res.status(httpStatus.OK).json({
    status: 'success',
    adminMessage: message, // Include the updated admin message in the response
    data: updatedSeller // Include the updated seller information
  });
};


const approveSeller = async (req, res) => {
  const { sellerId } = req.params;

  try {
    // Delete existing messages for the sellerId
    await Message.deleteMany({ sellerId });

    // Approve the seller
    const updatedSeller = await sellerService.approveSellerById(sellerId);

    // Send the response
    res.status(httpStatus.OK).json({
      status: 'success',
      data: updatedSeller // Include the updated seller information
    });
  } catch (error) {
    // Handle errors (e.g., log the error, send a response)
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'An error occurred while approving the seller.'
    });
  }
};




module.exports = {
  createSeller,
  getSellers,
  getSeller,
  updateSeller,
  deleteSeller,
  approveSeller,
  disapproveSeller,
  getProductCountBySeller
};