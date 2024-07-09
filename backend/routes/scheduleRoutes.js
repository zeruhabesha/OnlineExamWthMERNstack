const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const authMiddleware = require('../middleware/authMiddleware'); // Adjust the path as needed
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
// Create a new schedule
router.post('/', verifyToken, scheduleController.createSchedule);

// Get all schedules
router.get('/', scheduleController.getSchedules);

// Get a single schedule by ID
router.get('/:id', scheduleController.getScheduleById);

// Update a schedule by ID
router.put('/:id', verifyToken, scheduleController.updateSchedule);

// Delete a schedule by ID
router.delete('/:id', verifyToken, scheduleController.deleteSchedule);

module.exports = router;
