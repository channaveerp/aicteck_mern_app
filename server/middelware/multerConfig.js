const multer = require('multer');
const path = require('path');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save files in the 'uploads/' folder
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Unique filename
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter: Accept only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only image files are allowed!'), false); // Reject non-image files
  }
};

// Initialize Multer
const upload = multer({ storage, fileFilter });

module.exports = upload;
