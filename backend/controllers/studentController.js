const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Exam = require('../models/Exam');
const ExamResult = require('../models/ExamResult');
const ReadingMaterial = require('../models/ReadingMaterial');
const Announcement = require('../models/Announcement');
const Schedule = require('../models/Schedule');
const Student = require('../models/Student'); // Assuming there's a User model for students

// Login function (placeholder for actual implementation)
exports.login = (req, res) => {
  const { email, password } = req.body;

  Student.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
          }

          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
          res.status(200).json({ token });
        })
        .catch(err => res.status(500).json({ message: 'Server error', error: err }));
    })
    .catch(err => res.status(500).json({ message: 'Server error', error: err }));
};

// Logout function
exports.logout = (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
};

// Take exam
exports.takeExam = (req, res) => {
  const { examId, answers } = req.body;

  Exam.findById(examId)
    .then(exam => {
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }

      let score = 0;
      for (let i = 0; i < answers.length; i++) {
        if (answers[i] === exam.questions[i].correctAnswer) {
          score++;
        }
      }

      const examResult = new ExamResult({
        studentId: req.user.id,
        examId: examId,
        score: score,
        answers: answers
      });

      return examResult.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Exam taken successfully', result });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Failed to take exam', error });
    });
};

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

// View results
exports.viewResult = (req, res) => {
  ExamResult.find({ studentId: req.user.id })
    .populate('examId')
    .then(results => {
      res.status(200).json(results);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Failed to view results', error });
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



// const getReadingMaterials = async (req, res) => {
//   try {
//       const materials = await ReadingMaterial.find();
//       res.json(materials);
//   } catch (error) {
//       res.status(500).json({ message: 'Error getting reading materials', error });
//   }
// };

exports.countReadingMaterials = async (req, res) => {
  try {
      const count = await ReadingMaterial.countDocuments();
      res.json({ count });
  } catch (error) {
      res.status(500).json({ message: 'Error counting reading materials', error });
  }
};
