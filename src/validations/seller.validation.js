const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSeller = {
  body: Joi.object().keys({
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

const updateSeller = {
  params: Joi.object().keys({
    sellerId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      responsibleManagingParty: Joi.object().keys({
        photoId: Joi.string(), // Optional for update
      }),
      licenses: Joi.object().keys({
        cannabisLicense: Joi.string(), // Optional for update
        resellersPermit: Joi.string(), // Optional for update
      }),
      billingAddress: Joi.object().keys({
        street: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        zipCode: Joi.string(),
        country: Joi.string(),
      }),
      paymentOption: Joi.object().keys({
        method: Joi.string(),
        details: Joi.object().keys({
          cardNumber: Joi.string(), // Optional for update
          expirationDate: Joi.string(), // Optional for update
          cvv: Joi.string(), // Optional for update
          paypalEmail: Joi.string(), // Optional for update
        }),
      }),
    })
    .min(1), // At least one field must be present for update
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
  updateSeller,
  deleteSeller,
  
};