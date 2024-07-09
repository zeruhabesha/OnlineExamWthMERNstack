const Student = require('../models/Student');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append file extension
  }
});

const upload = multer({ storage: storage }).single('image');

// Fetch Admin Profile
exports.fetchAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findOne({ username: req.user.username });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
// Admin login
exports.loginAdmin = async (req, res) => {
  const { email, password, role } = req.body; // userType can be 'admin' or 'student'

  try {
    let user;
    if (role === 'admin') {
      user = await Admin.findOne({ email });
    } else if (role === 'student') {
      user = await Student.findOne({ email });
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password does not match' });
    }

    // Include additional fields in the payload
    const payload = {
      user: {
        id: user.id,
        RegNo: user.RegNo,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        department: user.department,
        role: user.role,
        image: user.image,
        createdAt: user.createdAt,
        stream: user.stream,
        blind: user.blind,
        schoolCode: user.schoolCode,
        region: user.region,
        zone: user.zone,
        city: user.city,
        woreda: user.woreda,
        status: user.status,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token,
          id: user.id,
          RegNo: user.RegNo,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          department: user.department,
          role: user.role,
          image: user.image,
          createdAt: user.createdAt,
          stream: user.stream,
          blind: user.blind,
          schoolCode: user.schoolCode,
          region: user.region,
          zone: user.zone,
          city: user.city,
          woreda: user.woreda,
          status: user.status,
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};



// Admin logout
exports.logout = (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
};



exports.uploadMaterial = (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      console.error('Multer error:', err);
      return res.status(500).json({ message: 'Error uploading file', error: err });
    } else if (err) {
      // An unknown error occurred
      console.error('Unknown error during file upload:', err);
      return res.status(500).json({ message: 'Unknown error uploading file', error: err });
    }

    try {
      // Handle other operations after file upload if needed
      const { filename, path } = req.file;
      res.status(200).json({ filename, path });
    } catch (error) {
      console.error('Error handling file upload:', error);
      res.status(500).json({ message: 'Error handling file upload', error });
    }
  });
};

exports.postResult = (req, res) => {
  const { studentId, examId, score } = req.body;

  ExamResult.create({
    studentId: studentId,
    examId: examId,
    score: score
  })
  .then(result => {
    res.status(200).json({ message: 'Exam result posted successfully', result });
  })
  .catch(error => {
    console.error(error);
    res.status(500).json({ message: 'Failed to post exam result', error });
  });
};

exports.uploadQuestionAnswer = (req, res) => {
  const { examId, questions, answers } = req.body;

  Exam.create({
    examId: examId,
    questions: questions,
    answers: answers
  })
  .then(exam => {
    res.status(200).json({ message: 'Exam questions & answers uploaded successfully', exam });
  })
  .catch(error => {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload exam questions & answers', error });
  });
};

// Register a new admin
exports.registerAdmin = (req, res) => {
  // Assuming upload middleware is configured and used appropriately before this handler
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading file', err });
    }

    try {
      const { username, email, password, firstName, lastName, phoneNumber, department, role } = req.body;
      const image = req.file ? req.file.path : null;

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new Admin instance
      const newAdmin = new Admin({
        username,
        email,
        password: hashedPassword, // Save hashed password
        firstName,
        lastName,
        phoneNumber,
        department,
        role,
        image, // Optional: save image path if uploaded
      });

      // Save admin to database
      await newAdmin.save();

      // Return successful response
      res.status(201).json(newAdmin);
    } catch (error) {
      // Handle errors
      console.error('Error creating Admin:', error);
      res.status(500).json({ message: 'Error creating Admin', error });
    }
  });
};


// Update admin details
exports.updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { username, password, firstName, lastName, email, phoneNumber, department } = req.body;

  try {
      const updatedData = { username, firstName, lastName, email, phoneNumber, department };
      if (password) {
          updatedData.password = await bcrypt.hash(password, 10);
      }
      if (req.file) {
          updatedData.image = req.file.filename; // Update image if new one is uploaded
      }

      const updatedAdmin = await Admin.findByIdAndUpdate(id, updatedData, { new: true });

      if (!updatedAdmin) {
          return res.status(404).json({ message: 'Admin not found' });
      }

      res.status(200).json({ message: 'Admin updated successfully', updatedAdmin });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update admin', error });
  }
};

// Delete an admin
exports.deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAdmin = await Admin.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin deleted successfully', deletedAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete admin', error });
  }
};


exports.registerStudent = (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(500).json({ message: 'Error uploading file', error: err });
    } else if (err) {
      console.error('Unknown error during file upload:', err);
      return res.status(500).json({ message: 'Unknown error uploading file', error: err });
    }

    const { username, password, firstName, lastName, email, phoneNumber, stream, blind, schoolCode, region, zone, city, woreda, status } = req.body;

    try {
      // Convert blind value to 'yes' or 'no'
      const blindValue = blind === 'true' ? 'yes' : 'no';

      // Check if a student with the same email or username already exists
      const existingStudent = await Student.findOne({ $or: [{ email }, { username }] });
      if (existingStudent) {
        return res.status(400).json({ message: 'Student with the same email or username already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new student instance
      const newStudent = new Student({
        username,
        password: hashedPassword,
        firstName,
        lastName,
        email,
        phoneNumber,
        stream,
        blind: blindValue,
        schoolCode,
        region,
        zone,
        city,
        woreda,
        status,
        image: req.file ? req.file.filename : null // Save image filename if uploaded
      });

      // Save the new student to the database
      await newStudent.save();
      res.status(201).json({ message: 'Student registered successfully', newStudent });
    } catch (error) {
      console.error('Error registering student:', error);
      res.status(500).json({ message: 'Failed to register student', error });
    }
  });
};

// Update student details
exports.updateStudent = (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(500).json({ message: 'Error uploading file', error: err });
    } else if (err) {
      console.error('Unknown error during file upload:', err);
      return res.status(500).json({ message: 'Unknown error uploading file', error: err });
    }

    const { id } = req.params;
    const { username, password, firstName, lastName, email, phoneNumber, stream, blind, schoolCode, region, zone, city, woreda, status } = req.body;

    try {
      // Check for duplicate email and username
      const duplicateStudent = await Student.findOne({
        $or: [{ email }, { username }],
        _id: { $ne: id } // Exclude the current student from the check
      });

      if (duplicateStudent) {
        return res.status(400).json({ message: 'Email or username already exists' });
      }

      const updatedData = {
        username,
        firstName,
        lastName,
        email,
        phoneNumber,
        stream,
        blind: blind === 'true' ? 'yes' : 'no', // Convert blind value to 'yes' or 'no'
        schoolCode,
        region,
        zone,
        city,
        woreda,
        status
      };

      if (password) {
        updatedData.password = await bcrypt.hash(password, 10);
      }
      if (req.file) {
        updatedData.image = req.file.filename; // Update image if new one is uploaded
      }

      const updatedStudent = await Student.findByIdAndUpdate(id, updatedData, { new: true });

      if (!updatedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }

      res.status(200).json({ message: 'Student updated successfully', updatedStudent });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update student', error });
    }
  });
};
// Delete a student
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully', deletedStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete student', error });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve students', error });
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve student', error });
  }
};

// Get students by department
exports.getStudentsByDepartment = async (req, res) => {
  const { department } = req.params;

  try {
    const students = await Student.find({ department });

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'No students found in this department' });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve students', error });
  }
};

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve admins', error });
  }
};

// Get admin by ID
exports.getAdminById = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve admin', error });
  }
};



// const getAllStudents = async (req, res) => {
//     try {
//         const students = await Student.find();
//         res.json(students);
//     } catch (error) {
//         res.status(500).json({ message: 'Error getting students', error });
//     }
// };
exports.countStudents = async (req, res) => {

    try {
        const count = await Student.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Error counting students', error });
    }
};

