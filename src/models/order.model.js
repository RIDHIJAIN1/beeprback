const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
// const { required } = require('joi');

const orderSchema = mongoose.Schema(
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
   
  },
  {
    timestamps: true,
  }
);

// Add plugin that converts mongoose to json
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);


const Orders = mongoose.model('Orders', orderSchema);
module.exports = Orders;