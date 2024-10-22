const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
// const { required } = require('joi');

const Favoriteschema = mongoose.Schema(
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
     
      isLiked: {
        type: Boolean,
        default: true,
      },
   
  },
  {
    timestamps: true,
  }
);

// Add plugin that converts mongoose to json
Favoriteschema.plugin(toJSON);
Favoriteschema.plugin(paginate);


const Favorites = mongoose.model('Favorites', Favoriteschema);
module.exports = Favorites;