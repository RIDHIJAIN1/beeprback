const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const messageSchema = mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Seller', // Assuming you have a Seller model
    },
  
    message: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Adding toJSON and paginate plugin
messageSchema.plugin(toJSON);
messageSchema.plugin(paginate);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
