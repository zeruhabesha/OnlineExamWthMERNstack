const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const readingMaterialSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  filePath: { type: String, required: false }, // Path to the uploaded file
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReadingMaterial', readingMaterialSchema);
