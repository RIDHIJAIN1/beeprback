const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const sellerValidation = require('../../validations/seller.validation');
const sellerController = require('../../controllers/seller.controller');
const upload = require('../../middlewares/imageUpload'); // Import your image upload middleware
const router = express.Router();

// Route for creating a seller with image and PDF uploads
router.post(
  '/', auth('seller'),
  upload.fields([{ name: 'photoId', maxCount: 1 }, { name: 'cannabisLicense', maxCount: 1 }, { name: 'resellersPermit', maxCount: 1 }]), // Use fields if you are uploading multiple files with different fields
  validate(sellerValidation.createSeller), // Validate the seller data
  sellerController.createSeller // Controller to handle the creation logic
);

// Optionally, you can add more routes for getting, updating, deleting sellers, etc.
router.get('/', auth('sellersForAdmin'), sellerController.getSellers);
router.get('/:sellerId', auth('sellersForAdmin'), sellerController.getSeller);
router.patch('/:sellerId', auth('sellersForAdmin'), validate(sellerValidation.updateSeller), sellerController.updateSeller);
router.delete('/:sellerId', auth("sellersForAdmin"), sellerController.deleteSeller);
router.patch('/:sellerId/approve', auth('sellersForAdmin'), sellerController.approveSeller); // Route to approve seller
router.patch('/:sellerId/disapprove', auth('sellersForAdmin'), sellerController.disapproveSeller); // Route to approve seller

module.exports = router;