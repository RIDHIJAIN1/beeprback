const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
// const { required } = require('joi');

const userProfileSchema = mongoose.Schema(
  {
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the Question model kya
        required: true,
      },
    categoryproduct_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoryproducts', // Reference to the Question model
      
      },
      image: {
        type: String,
        required: true,
      },
   
  },
  {
    timestamps: true,
  }
);

// Add plugin that converts mongoose to json
userProfileSchema.plugin(toJSON);
userProfileSchema.plugin(paginate);


const userProfile = mongoose.model('userProfile', userProfileSchema);
module.exports = userProfile;