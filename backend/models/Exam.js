const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true }
});

const examSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: { type: [questionSchema], required: true },
  status: { type: String, default: '0' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exam', examSchema);


