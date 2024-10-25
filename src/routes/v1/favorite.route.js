const express = require('express');
const favouriteController = require('../../controllers/favorite.controller');
const auth = require('../../middlewares/auth'); // Middleware for authentication if required
const authMiddleware = require('../../middlewares/authMiddleware'); // Middleware for authentication if required

const router = express.Router();

// Create or toggle a favourite (like or dislike)
router.post('/', authMiddleware, favouriteController.createOrToggleFavourite);

// Get all favourites for a user (optional user_id query param)
router.get('/',authMiddleware, favouriteController.getAllFavourites);

// Get a favourite by its ID
router.get('/:favouriteId',authMiddleware , favouriteController.getFavourite);

// Delete a favourite by its ID
router.delete('/:favouriteId', auth(), favouriteController.deleteFavourite);

module.exports = router;
