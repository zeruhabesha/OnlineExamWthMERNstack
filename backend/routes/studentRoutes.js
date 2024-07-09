const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes for student functionalities
router.post('/login', studentController.login);
router.post('/logout', authMiddleware, studentController.logout);
router.post('/take-exam', authMiddleware, studentController.takeExam);
router.get('/reading-materials', authMiddleware, studentController.getReadingMaterials);
router.get('/results', authMiddleware, studentController.viewResult);
router.get('/announcements-schedules', authMiddleware, studentController.viewAnnouncementAndSchedule);

module.exports = router;
