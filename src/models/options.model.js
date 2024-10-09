const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
// const { required } = require('joi');

const optionSchema = mongoose.Schema(
  {
    question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question', // Reference to the Question model
        required: true,
      },
      type: {
        type: String,
        required: true,
        enum: ['next_question', 'product_category'], // Can either be 'next_question' or 'product_category'
      },
      next_question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question', // Reference to the next question if type is 'next_question'
        required: function() {
          return this.type === 'next_question';
        },
      },
      category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Reference to the category if type is 'product_category'
        required: function() {
          return this.type === 'product_category';
        },
      },
      value: {
        type: String,
        required: true, // The value associated with the option
        trim: true,
      },
  },
  {
    timestamps: true,
  }
);

// Add plugin that converts mongoose to json
optionSchema.plugin(toJSON);
optionSchema.plugin(paginate);


const Options = mongoose.model('Options', optionSchema);
module.exports = Options;