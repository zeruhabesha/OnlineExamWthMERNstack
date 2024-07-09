const express = require('express');
const router = express.Router();
const examResultController = require('../controllers/examResultController');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify token
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

// Routes
router.post('/', verifyToken, examResultController.createExamResult);
router.get('/', verifyToken, examResultController.getExamResults);
router.get('/:id', verifyToken, examResultController.getExamResultById);
router.put('/:id', verifyToken, examResultController.updateExamResult);
router.delete('/:id', verifyToken, examResultController.deleteExamResult);
router.get('/student/:studentId/exam/:examId', verifyToken, examResultController.getExamResultsByStudentAndExam);
router.get('/student/:studentId', verifyToken, examResultController.getExamResultsByStudentId);
router.get('/top', verifyToken, examResultController.getTopExamResults); // Route for top 10 results

module.exports = router;

