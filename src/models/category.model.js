const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true, // Indicates whether the category is "deleted"
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;