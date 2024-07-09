const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route for admin registration (creating an admin)
router.post('/register', authController.registerAdmin);

// Route for admin login
router.post('/login', authController.loginAdmin);

// Route for student login
router.post('/student/login', authController.loginStudent);

module.exports = router;
