const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const sellerSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    photoId: {
      type: String,
      required: true,
    },
    cannabisLicense: {
      type: String,
      required: true,
    },
    resellersPermit: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    paymentOption: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false, // Default to false until approved by admin
    },
  },
  {
    timestamps: true,
  }
);

// Add plugins for JSON conversion and pagination
sellerSchema.plugin(toJSON);
sellerSchema.plugin(paginate);

/**
 * @typedef Seller
 */
const Seller = mongoose.model('Seller', sellerSchema);
module.exports = Seller;
