const multer = require('multer');
const path = require('path');

// Define storage for the uploads using an absolute path
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Resolve the uploads folder relative to the root of the project
    const uploadPath = path.resolve(__dirname, '../../uploads');
    cb(null, uploadPath); // Use the resolved path for the uploads folder
  },
  filename: (req, file, cb) => {
    // Create a unique filename with the original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Append the file extension
  }
});

// File filter to accept only images (jpeg, jpg, png) and PDFs
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|pdf/; // Allowed file types
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Check extension
  const mimetype = filetypes.test(file.mimetype); // Check MIME type

  if (extname && mimetype) {
    return cb(null, true); // Accept the file
  }
  cb(new Error('Error: File type not supported!')); // Reject the file
};

// Create the upload middleware
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5 MB
});

module.exports = upload;
