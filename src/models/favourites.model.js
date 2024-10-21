const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
// const { required } = require('joi');

const FavouriteSchema = mongoose.Schema(
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
        default: false,
      },
   
  },
  {
    timestamps: true,
  }
);

// Add plugin that converts mongoose to json
FavouriteSchema.plugin(toJSON);
FavouriteSchema.plugin(paginate);


const Favourites = mongoose.model('Favourites', FavouriteSchema);
module.exports = Favourites;