const ExamResult = require('../models/ExamResult');
const Exam = require('../models/Exam');
const Student = require('../models/Student');  

exports.createExamResult = async (req, res) => {
    try {
      const { studentId, examId, answers } = req.body;
  
      const exam = await Exam.findById(examId);
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }
  
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      let score = 0;
      const answerList = exam.questions.map((question, index) => {
        const correctAnswer = question.correctAnswer;
        const selectedAnswer = answers[index]?.selectedAnswer || "";
        if (correctAnswer === selectedAnswer) {
          score++;
        }
        return {
          questionId: question._id,
          selectedAnswer,
          correctAnswer
        };
      });
  
      const newExamResult = new ExamResult({
        studentId,
        examId,
        score,
        answers: answerList
      });
  
      const savedExamResult = await newExamResult.save();
      res.status(201).json(savedExamResult);
    } catch (error) {
      console.error('Error creating exam result:', error.message);
      res.status(500).json({ message: 'Error creating exam result', error: error.message });
    }
  };
  

// exports.getExamResults = async (req, res) => {
//   try {
//     const examResults = await ExamResult.find().populate('studentId', 'username').populate('examId', 'title');
//     res.status(200).json(examResults);
//   } catch (error) {
//     console.error('Error fetching exam results:', error.message);
//     res.status(500).json({ message: 'Error fetching exam results', error: error.message });
//   }
// };

// exports.getExamResultById = async (req, res) => {
//   try {
//     const examResult = await ExamResult.findById(req.params.id).populate('studentId', 'username').populate('examId', 'title');
//     if (!examResult) {
//       return res.status(404).json({ message: 'Exam result not found' });
//     }
//     res.status(200).json(examResult);
//   } catch (error) {
//     console.error('Error fetching exam result by ID:', error.message);
//     res.status(500).json({ message: 'Error fetching exam result', error: error.message });
//   }
// };





// In your controllers file
exports.getExamResults = async (req, res) => {
  try {
    const examResults = await ExamResult.find().populate('studentId', 'username').populate('examId', 'title');
    res.status(200).json(examResults);
  } catch (error) {
    console.error('Error fetching exam results:', error.message);
    res.status(500).json({ message: 'Error fetching exam results', error: error.message });
  }
};

exports.getExamResultById = async (req, res) => {
  try {
    const examResult = await ExamResult.findById(req.params.id).populate('studentId', 'username').populate('examId', 'title');
    if (!examResult) {
      return res.status(404).json({ message: 'Exam result not found' });
    }
    res.status(200).json(examResult);
  } catch (error) {
    console.error('Error fetching exam result by ID:', error.message);
    res.status(500).json({ message: 'Error fetching exam result', error: error.message });
  }
};


exports.getExamResultsByStudentId = async (req, res) => {
  const studentId = req.params.studentId;

  try {
    const examResults = await ExamResult.find({ studentId: studentId });
    res.status(200).json(examResults);
  } catch (error) {
    console.error('Error fetching exam results:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getExamResultsByStudentAndExam = async (req, res) => {
  const { studentId, examId } = req.params;

  try {
    const examResult = await ExamResult.findOne({ studentId, examId });

    if (!examResult) {
      return res.status(404).json({ message: 'No exam result found for the given student and exam' });
    }

    res.status(200).json(examResult);
  } catch (error) {
    console.error('Error fetching exam result by student and exam:', error.message);
    res.status(500).json({ message: 'Error fetching exam result', error: error.message });
  }
};


exports.updateExamResult = async (req, res) => {
  try {
    const { studentId, examId, answers } = req.body;

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    let score = 0;
    const answerList = exam.questions.map((question, index) => {
      const correctAnswer = question.correctAnswer;
      const selectedAnswer = answers[index]?.selectedAnswer || "";
      if (correctAnswer === selectedAnswer) {
        score++;
      }
      return {
        questionId: question._id,
        selectedAnswer,
        correctAnswer
      };
    });

    const updatedExamResult = await ExamResult.findByIdAndUpdate(
      req.params.id,
      { studentId, examId, score, answers: answerList },
      { new: true }
    ).populate('studentId', 'username').populate('examId', 'title');

    if (!updatedExamResult) {
      return res.status(404).json({ message: 'Exam result not found' });
    }

    res.status(200).json(updatedExamResult);
  } catch (error) {
    console.error('Error updating exam result:', error.message);
    res.status(500).json({ message: 'Error updating exam result', error: error.message });
  }
};

exports.deleteExamResult = async (req, res) => {
  try {
    const deletedExamResult = await ExamResult.findByIdAndDelete(req.params.id);
    if (!deletedExamResult) {
      return res.status(404).json({ message: 'Exam result not found' });
    }
    res.status(200).json({ message: 'Exam result deleted' });
  } catch (error) {
    console.error('Error deleting exam result:', error.message);
    res.status(500).json({ message: 'Error deleting exam result', error: error.message });
  }
};

exports.countExams = async (req, res) => {
  try {
    const count = await ExamResult.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error counting exams', error });
  }
};


exports.getTopExamResults = async (req, res) => {
  try {
    const examResults = await ExamResult.find()
      .sort({ score: -1 })
      .limit(10)
      .populate('studentId', 'username')
      .populate('examId', 'title');

    res.status(200).json(examResults);
  } catch (error) {
    console.error('Error fetching top exam results:', error.message);
    res.status(500).json({ message: 'Error fetching top exam results', error: error.message });
  }
};