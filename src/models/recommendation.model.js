const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const recommendationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true, // Indicates whether the Recommendation is "deleted"
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

recommendationSchema.plugin(toJSON);
recommendationSchema.plugin(paginate);

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

module.exports = Recommendation;