const httpStatus = require('http-status');
const { Favorites, Favorite } = require('../models'); // Import the Favourites model
const ApiError = require('../utils/ApiError');
const { User, Product } = require('../models');

/**
 * Create or toggle a favourite (like or dislike)
 * @param {Object} req - Request object containing userId and body
 * @returns {Promise<Favourites>}
 */
const createOrToggleFavourite = async (req) => {
  const userId = req.userId; // Extract userId from the token (attached by the auth middleware)
  const { product_id } = req.body;

  const userExists = await User.findById(userId);
  const productExists = await Product.findById(product_id);

  if (!userExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!productExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  // Check if the favourite already exists
  const existingFavourite = await Favorite.findOne({ user_id: userId, product_id });

  if (existingFavourite) {
    existingFavourite.isLiked = !existingFavourite.isLiked;
    await existingFavourite.save();
    return existingFavourite;
  }

  // If it doesn't exist, create a new favourite entry
  return Favorite.create({ user_id: userId, product_id, isLiked: true });
};

/**
 * Get all favourites for a user
 * @param {ObjectId} userId
 * @returns {Promise<Favourites[]>}
 */
const getAllFavourites = async (userId) => {
  // Check if userId is provided
  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authenticate first');
  }

  // Use aggregation to join Favorites with Products
  const favouritesWithProducts = await Favorite.aggregate([
    {
      $match: { user_id: userId } // Match favorites for the specific user
    },
    {
      $lookup: {
        from: 'products', // The name of the Products collection
        localField: 'product_id', // Field from Favorites
        foreignField: '_id', // Field from Products
        as: 'product' // Name of the output array
      }
    },
    {
      $unwind: {
        path: '$product', // Unwind the product array to get single product objects
        preserveNullAndEmptyArrays: true // Keep favorites without products
      }
    },
    {
      $project: {
        _id: 1,
        user_id: 1,
        product_id: 1,
        isLiked: 1,
        product: {
          _id: '$product._id',
          name: '$product.name',
          price: '$product.price',
          description: '$product.description',
          // Include any other fields you need from the product
        }
      }
    }
  ]);

  if (!favouritesWithProducts || favouritesWithProducts.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No favourites found for this user');
  }

  return favouritesWithProducts;
};


/**
 * Get favourite by id
 * @param {ObjectId} id
 * @returns {Promise<Favourites>}
 */
const getFavouriteById = async (id) => {
  // Use aggregation to join Favorites with Products
  const favouriteWithProduct = await Favorite.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(id) } // Match the favorite by ID
    },
    {
      $lookup: {
        from: 'products', // The name of the Products collection
        localField: 'product_id', // Field from Favorites
        foreignField: '_id', // Field from Products
        as: 'product' // Name of the output array
      }
    },
    {
      $unwind: {
        path: '$product', // Unwind the product array to get single product objects
        preserveNullAndEmptyArrays: true // Optional: Keep the favourite entry if no product is found
      }
    },
    {
      $project: {
        _id: 1,
        user_id: 1,
        product_id: 1,
        isLiked: 1,
        product: {
          _id: '$product._id',
          name: '$product.name',
          price: '$product.price',
          description: '$product.description',
          // Include any other fields you need from the product
        }
      }
    }
  ]);

  if (!favouriteWithProduct || favouriteWithProduct.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Favourite not found');
  }

  return favouriteWithProduct[0]; // Return the first (and should be the only) entry
};

/**
 * Delete favourite by id
 * @param {ObjectId} favouriteId
 * @returns {Promise<Favourites>}
 */
const deleteFavouriteById = async (favouriteId) => {
  const favourite = await Favourites.findById(favouriteId);

  if (!favourite) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Favourite not found');
  }

  await favourite.remove();
  return favourite;
};

module.exports = {
  createOrToggleFavourite,
  getAllFavourites,
  getFavouriteById,
  deleteFavouriteById,
};
