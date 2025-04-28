// server/src/routes/api.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Generate unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Authentication token is required' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_default_secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      error: 'Invalid or expired token' 
    });
  }
};

// Simple test endpoint
router.get('/test', authenticateToken, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'API is working correctly',
    user: {
      uuid: req.user.uuid
    }
  });
});

// Chat endpoint that accepts file uploads
router.post('/chat', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    // Validate request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Process the uploaded file
    const uploadedFile = req.file;

    // Here you would typically process the file based on its content
    // This could include sending it to an AI service, parsing it, etc.
    
    // For demonstration, we'll just return file information
    const response = {
      success: true,
      data: {
        file: {
          originalName: uploadedFile.originalname,
          filename: uploadedFile.filename,
          size: uploadedFile.size,
          mimetype: uploadedFile.mimetype,
          path: uploadedFile.path
        },
        message: 'File uploaded successfully',
        uuid: req.user.uuid
      }
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error processing chat request:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while processing request'
    });
  }
});

module.exports = router;