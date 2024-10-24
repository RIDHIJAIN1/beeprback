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
    recommendedproduct_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RecommendedProducts', // Reference to the Question model
      
      },
      image: {
        type: String,
        default: null
      },

      bio: {
        type: String,
        maxlength: 500, // Limiting the length of the bio
        default: '', // Optional field with a default empty string
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