const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSeller = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
    paymentOption: Joi.string().required(),
  }),
  files: Joi.object().keys({
    photoId: Joi.object().required(), // Check for the file
    cannabisLicense: Joi.object().required(), // Check for the file
    resellersPermit: Joi.object().required(), // Check for the file
  }).required(),
};


const getSellers = {
  query: Joi.object().keys({
    sortBy: Joi.string().valid('createdAt', '-createdAt'),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    sellerId: Joi.string().hex().length(24), // Assuming sellerId is a 24-char hexadecimal string
   
  }),
};

const getSeller = {
  params: Joi.object().keys({
    sellerId: Joi.string().custom(objectId),
  }),
};

const updateSellerById = {
  body: Joi.object().keys({
    name: Joi.string().optional(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
    paymentOption: Joi.string().required(),
  }),
  files: Joi.object().keys({
    photoId: Joi.object().optional(),
    cannabisLicense: Joi.object().optional(),
    resellersPermit: Joi.object().optional(),
  }).optional().allow(null),
};

const deleteSeller = {
  params: Joi.object().keys({
    sellerId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createSeller,
  getSellers,
  getSeller,
  updateSellerById,
  deleteSeller,
  
};