const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Announcement = require('../models/Announcement');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append file extension
  }
});

const upload = multer({ storage: storage }).single('image');

// Create a new announcement
exports.createAnnouncement = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading file', error: err });
    }

    try {
      const { title, content } = req.body;
      const image = req.file ? req.file.path : null;
      const newAnnouncement = new Announcement({ title, content, image });
      await newAnnouncement.save();
      res.status(201).json(newAnnouncement);
    } catch (error) {
      res.status(500).json({ message: 'Error creating announcement', error });
    }
  });
};

// Update an announcement by ID
exports.updateAnnouncement = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading file', error: err });
    }

    try {
      const { title, content } = req.body;
      const updatedFields = { title, content };
      if (req.file) {
        updatedFields.image = req.file.path;
      }

      const updatedAnnouncement = await Announcement.findByIdAndUpdate(
        req.params.id,
        updatedFields,
        { new: true }
      );
      if (!updatedAnnouncement) {
        return res.status(404).json({ message: 'Announcement not found' });
      }
      res.status(200).json(updatedAnnouncement);
    } catch (error) {
      res.status(500).json({ message: 'Error updating announcement', error });
    }
  });
};

// Get all announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcements', error });
  }
};

// Get an announcement by ID
exports.getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.status(200).json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcement', error });
  }
};

// Delete an announcement by ID
exports.deleteAnnouncement = async (req, res) => {
  try {
    const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);
    if (!deletedAnnouncement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.status(200).json({ message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting announcement', error });
  }
};


// const getAnnouncements = async (req, res) => {
//   try {
//       const announcements = await Announcement.find();
//       res.json(announcements);
//   } catch (error) {
//       res.status(500).json({ message: 'Error getting announcements', error });
//   }
// };
exports.countAnnouncements = async (req, res) => {

  try {
      const count = await Announcement.countDocuments();
      res.json({ count });
  } catch (error) {
      res.status(500).json({ message: 'Error counting announcements', error });
  }
};


