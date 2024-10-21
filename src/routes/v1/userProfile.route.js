const express = require('express');
const userProfileController = require('../../controllers/userProfile.controller');
const upload = require('../../middlewares/imageUpload');
// const auth = require('../../middlewares/auth');
// const categoryValidation = require('../../validations/category.validation');

const router = express.Router();

// Create a new category
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }]), userProfileController.createUserProfile);

// Get all categories
router.get('/', userProfileController.getUserProfiles);

router.get('/:userProfileId?', userProfileController.getUserProfileById);
// Get a category by ID


// Update a category by ID
router.patch('/:userProfileId', userProfileController.updateUserProfile);
router.delete('/:userProfileId', userProfileController.deleteUserProfile);

module.exports = router;