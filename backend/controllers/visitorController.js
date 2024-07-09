const ReadingMaterial = require('../models/ReadingMaterial');
const Announcement = require('../models/Announcement');
const Schedule = require('../models/Schedule');

// Get reading materials
exports.getReadingMaterials = (req, res) => {
  ReadingMaterial.find()
    .then(materials => {
      res.status(200).json(materials);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Failed to get reading materials', error });
    });
};

// View announcements and schedules
exports.viewAnnouncementAndSchedule = (req, res) => {
  Announcement.find()
    .then(announcements => {
      Schedule.find()
        .then(schedules => {
          res.status(200).json({ announcements, schedules });
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: 'Failed to get schedules', error });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Failed to get announcements', error });
    });
};
