
const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const authMiddleware = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

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

// Create a new exam
router.post('/', examController.createExam);

// Get all exams
router.get('/', verifyToken, examController.getExams);

// Get a single exam by ID
router.get('/:id', verifyToken, examController.getExamById);

// Update an exam by ID
router.put('/:id', verifyToken, examController.updateExam);

// Delete an exam by ID
router.delete('/:id', verifyToken, examController.deleteExam);

module.exports = router;


