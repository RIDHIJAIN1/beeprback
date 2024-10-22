const express = require('express');
const userProfileController = require('../../controllers/userProfile.controller');
const upload = require('../../middlewares/imageUpload');
const authMiddleware = require('../../middlewares/authMiddleware');
// const auth = require('../../middlewares/auth');
// const categoryValidation = require('../../validations/category.validation');

const router = express.Router();

// Create a new category
router.post('/',authMiddleware, upload.fields([{ name: 'image', maxCount: 1 }]), userProfileController.createUserProfile);

// Get all categories
router.get('/', userProfileController.getUserProfiles);

router.get('/:userProfileId?', userProfileController.getUserProfileById);
// Get a category by ID


// Update a category by ID

router.delete('/:userProfileId', userProfileController.deleteUserProfile);

module.exports = router;