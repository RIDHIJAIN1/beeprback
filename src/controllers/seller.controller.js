const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const  sellerService  = require('../services/seller.service');

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
    userId: req.userId, // Ensure this is set from the token
    photoId: photoId[0].path,
    cannabisLicense: cannabisLicense[0].path,
    resellersPermit: resellersPermit[0].path,
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


// Get all sellers
const getSellers = catchAsync(async (req, res) => {
  const userFilter = {};
  if (req.query.name) {
    userFilter.name = { $regex: req.query.name, $options: 'i' }; // Case-insensitive search
  }
  if (req.query.role) {
    userFilter.role = req.query.role;
  }
  const sellerFilter = {}; // You can add other seller-specific filters here
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
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
const approveSeller = catchAsync(async (req, res) => {
  const seller = await sellerService.approveSellerById(req.params.sellerId);
  res.send(seller);
});

module.exports = {
  createSeller,
  getSellers,
  getSeller,
  updateSeller,
  deleteSeller,
  approveSeller,
};