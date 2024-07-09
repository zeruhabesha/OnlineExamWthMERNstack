const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const announcementSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String }, // Assuming the image is stored as a URL or file path
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Announcement', announcementSchema);
