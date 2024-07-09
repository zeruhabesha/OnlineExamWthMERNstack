const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

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
// Routes for admin to create, update, and delete announcements
router.post('/', verifyToken, adminMiddleware, announcementController.createAnnouncement);
router.put('/:id', verifyToken, adminMiddleware, announcementController.updateAnnouncement);
router.delete('/:id', verifyToken, adminMiddleware, announcementController.deleteAnnouncement);

// Routes for students and viewers to get announcements
router.get('/', announcementController.getAnnouncements); // Get all announcements
router.get('/:id', announcementController.getAnnouncementById); // Get announcement by ID

module.exports = router;
