function validateform(event){
// BACKEND: Node.js server to save the images
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Only accept JPEG images
    if (file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG files are allowed!'));
    }
  },
});

// Route to handle file upload
app.post('/upload', upload.fields([
  { name: 'aadhar', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'community', maxCount: 1 },
  { name: 'income', maxCount: 1 },
]), (req, res) => {
  try {
    console.log('Files uploaded:', req.files);
    res.status(200).send('Files uploaded successfully!');
  } catch (error) {
    res.status(500).send('Error uploading files.');
  }
});

// Serve the upload directory for testing purposes (optional)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
}