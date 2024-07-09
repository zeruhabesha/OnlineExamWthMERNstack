const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');

// Routes for visitor functionalities
router.get('/reading-materials', visitorController.getReadingMaterials);
router.get('/announcements-schedules', visitorController.viewAnnouncementAndSchedule);

module.exports = router;
