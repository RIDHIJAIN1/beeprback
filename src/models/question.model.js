const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
// const { required } = require('joi');

const questionSchema = mongoose.Schema(
  {
   content:{
    type: String,
    required:true,
    trim: true
   },
    
  },
  {
    timestamps: true,
  }
);

// Add plugin that converts mongoose to json
questionSchema.plugin(toJSON);
questionSchema.plugin(paginate);


const Question = mongoose.model('Question', questionSchema);
module.exports = Question;