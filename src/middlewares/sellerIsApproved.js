const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const  sellerService  = require('../services/seller.service');

const sellerIsApproved = async(req, res, next) => {
    const seller = await sellerService.getSellerByUserId(req.user._id);
    if (!seller) 
      return res.send(new ApiError(httpStatus.NOT_FOUND, 'Seller not found'));
    if (!seller.isApproved) 
      return res.send(new ApiError(httpStatus.NOT_FOUND, 'Seller not approved'));
    next(); 

};



module.exports = sellerIsApproved;