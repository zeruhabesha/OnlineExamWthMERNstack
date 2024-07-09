const ReadingMaterial = require('../models/ReadingMaterial');
const path = require('path');
const fs = require('fs');

// Create a new reading material (Admin access only)
exports.createReadingMaterial = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }
    const filePath = req.file.path;
    const newMaterial = new ReadingMaterial({ title, description, filePath });
    await newMaterial.save();
    res.status(201).json(newMaterial);
  } catch (error) {
    res.status(500).json({ message: 'Error creating reading material', error });
  }
};

// Update reading material by ID (Admin access only)
exports.updateReadingMaterial = async (req, res) => {
  try {
    const { title, description } = req.body;
    const updatedMaterial = await ReadingMaterial.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    if (!updatedMaterial) {
      return res.status(404).json({ message: 'Reading material not found' });
    }
    res.status(200).json(updatedMaterial);
  } catch (error) {
    res.status(500).json({ message: 'Error updating reading material', error });
  }
};

// Delete reading material by ID (Admin access only)
exports.deleteReadingMaterial = async (req, res) => {
  try {
    const material = await ReadingMaterial.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Reading material not found' });
    }

    const filePath = path.resolve(material.filePath);
    
    // Check if the file exists before attempting to delete it
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, async (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error deleting file', error: err });
        }

        await material.remove();
        res.status(200).json({ message: 'Reading material deleted' });
      });
    } else {
      // If the file does not exist, log a warning and still remove the material from the database
      console.warn(`File at path ${filePath} does not exist, skipping file deletion.`);
      await material.remove();
      res.status(200).json({ message: 'Reading material deleted, but file was not found on the server.' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Error deleting reading material', error });
  }
};

// Get all reading materials (Admin access only)
exports.getAllReadingMaterials = async (req, res) => {
  try {
    const materials = await ReadingMaterial.find();
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reading materials', error });
  }
};

// Get reading material by ID (Student and Viewer access)
exports.getReadingMaterialById = async (req, res) => {
  try {
    const material = await ReadingMaterial.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Reading material not found' });
    }
    res.status(200).json(material);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reading material', error });
  }
};

// Download reading material file by ID (Student and Viewer access)
exports.downloadReadingMaterialFile = async (req, res) => {
  try {
    const material = await ReadingMaterial.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Reading material not found' });
    }
    const filePath = path.resolve(material.filePath);
    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: 'Error downloading file', error });
  }
};
