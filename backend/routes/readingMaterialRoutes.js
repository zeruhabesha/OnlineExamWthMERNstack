const express = require('express');
const router = express.Router();
const readingMaterialController = require('../controllers/readingMaterialController');
const adminMiddleware = require('../middleware/adminMiddleware'); // Admin Check Middleware
const multer = require('multer');
const path = require('path');
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded.user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Token is not valid' });
    }
  };
// Admin routes
router.post('/', verifyToken, adminMiddleware, upload.single('file'), readingMaterialController.createReadingMaterial);
router.put('/:id', verifyToken, adminMiddleware, readingMaterialController.updateReadingMaterial);
router.delete('/:id', verifyToken, adminMiddleware, readingMaterialController.deleteReadingMaterial);
router.get('/all', readingMaterialController.getAllReadingMaterials);

// Student and Viewer routes
router.get('/:id', readingMaterialController.getReadingMaterialById);
router.get('/download/:id', readingMaterialController.downloadReadingMaterialFile);

module.exports = router;
