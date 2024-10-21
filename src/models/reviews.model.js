const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
// const { required } = require('joi');

const reviewSchema = mongoose.Schema(
  {
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', // Reference to the Question model
        required: true,
      },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products', // Reference to the Question model
        required: true,
      },
      rating: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
   
  },
  {
    timestamps: true,
  }
);

// Add plugin that converts mongoose to json
reviewSchema.plugin(toJSON);
reviewSchema.plugin(paginate);


const Reviews = mongoose.model('Reviews', reviewSchema);
module.exports = Reviews;