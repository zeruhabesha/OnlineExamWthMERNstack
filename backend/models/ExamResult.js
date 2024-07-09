const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  selectedAnswer: { type: String, required: true },
  correctAnswer: { type: String, required: true }
});

const examResultSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true }, 
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  score: { type: Number, required: true },
  answers: [answerSchema],
  takenAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExamResult', examResultSchema);

