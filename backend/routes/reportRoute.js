const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const studentController = require('../controllers/studentController');
const adminController = require('../controllers/adminController');
const examResultController = require('../controllers/examResultController');
const announcementController = require('../controllers/announcementController');
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

// Route to get reading materials (example)
router.get('/reading-materials', verifyToken, studentController.getReadingMaterials);

// Route to get all students (example)
router.get('/students', verifyToken, adminController.getAllStudents);

// Route to get all exam results
router.get('/exams', verifyToken, examResultController.getExamResults);

// Route to get all announcements
router.get('/announcements', verifyToken, announcementController.getAnnouncements);

// Route to count reading materials
router.get('/count/reading-materials', verifyToken, studentController.countReadingMaterials);

// Route to count students
router.get('/count/students', verifyToken, adminController.countStudents);

// Route to count exams
router.get('/count/exams', verifyToken, examResultController.countExams);

// Route to count announcements
router.get('/count/announcements', verifyToken, announcementController.countAnnouncements);

module.exports = router;

