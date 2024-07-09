const Exam = require('../models/Exam');

// Create a new exam
exports.createExam = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const newExam = new Exam({ title, description, questions });
    const savedExam = await newExam.save();
    res.status(201).json(savedExam);
  } catch (error) {
    console.error('Error creating exam:', error.message);
    res.status(500).json({ message: 'Error creating exam', error: error.message });
  }
};

// Get all exams
exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find();
    res.status(200).json(exams);
  } catch (error) {
    console.error('Error fetching exams:', error.message);
    res.status(500).json({ message: 'Error fetching exams', error: error.message });
  }
};

// Get a single exam by ID
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json(exam);
  } catch (error) {
    console.error('Error fetching exam by ID:', error.message);
    res.status(500).json({ message: 'Error fetching exam', error: error.message });
  }
};

/// Example backend code to update exam status
exports.updateExam = async (req, res) => {
  try {
    const { title, description, questions, status } = req.body; // Ensure 'status' is properly received from request body
    const updatedExam = await Exam.findByIdAndUpdate(
      req.params.id,
      { title, description, questions, status },
      { new: true } // Return updated document
    );
    if (!updatedExam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json(updatedExam);
  } catch (error) {
    console.error('Error updating exam:', error.message);
    res.status(500).json({ message: 'Error updating exam', error: error.message });
  }
};

// Delete an exam by ID
exports.deleteExam = async (req, res) => {
  try {
    const deletedExam = await Exam.findByIdAndDelete(req.params.id);
    if (!deletedExam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json({ message: 'Exam deleted' });
  } catch (error) {
    console.error('Error deleting exam:', error.message);
    res.status(500).json({ message: 'Error deleting exam', error: error.message });
  }
};
