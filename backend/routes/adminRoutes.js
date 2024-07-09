const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const adminMiddleware = require('../middleware/adminMiddleware');
const path = require('path');
const fs = require('fs');
const authenticateToken = require('../middleware/auth');
const Admin = require('../models/Admin');
const Student = require('../models/Student');

const JWT_SECRET = process.env.JWT_SECRET;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

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

// Admin login
router.post('/login', adminController.loginAdmin);

// Admin logout
router.post('/logout', verifyToken, adminController.logout);

// Post exam result
router.post('/post-result', verifyToken, adminController.postResult);

// Upload exam questions & answers
router.post('/upload-question-answer', verifyToken, adminController.uploadQuestionAnswer);

// Register admin
router.post('/register-admin', verifyToken, adminController.registerAdmin);

// Update admin
router.put('/update-admin/:id', verifyToken, upload.single('image'), adminController.updateAdmin);

// Delete admin
router.delete('/delete-admin/:id', adminController.deleteAdmin);

// Get all admins
router.get('/admins', verifyToken, adminController.getAllAdmins);

// Get admin by ID
router.get('/admin/:id', verifyToken, adminController.getAdminById);

// Register student
router.post('/register-student', verifyToken, adminController.registerStudent);

// Update student
router.put('/update-student/:id', verifyToken, adminController.updateStudent);

// Delete student
router.delete('/delete-student/:id', verifyToken, adminController.deleteStudent);

// Get all students
router.get('/students', verifyToken, adminController.getAllStudents);

// Get student by ID
router.get('/student/:id', verifyToken, adminController.getStudentById);
router.get('/students/department/:department', adminController.getStudentsByDepartment);

// Get Admin Profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    let user;
    if (req.user.role === 'admin') {
      user = await Admin.findOne({ username: req.user.username });
    } else if (req.user.role === 'student') {
      user = await Student.findOne({ username: req.user.username });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update Admin Profile
router.put('/update-profile', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, stream, schoolCode, region, zone, city, woreda } = req.body;
    let user;

    if (req.user.role === 'admin') {
      user = await Admin.findOne({ username: req.user.username });
    } else if (req.user.role === 'student') {
      user = await Student.findOne({ username: req.user.username });
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update common fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    if (req.file) {
      user.image = req.file.path;
    }

    // Update student-specific fields
    if (req.user.role === 'student') {
      user.stream = stream || user.stream;
      user.schoolCode = schoolCode || user.schoolCode;
      user.region = region || user.region;
      user.zone = zone || user.zone;
      user.city = city || user.city;
      user.woreda = woreda || user.woreda;
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
