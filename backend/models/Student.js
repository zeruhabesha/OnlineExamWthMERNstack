const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('./counter'); // Adjust the path as necessary

const studentSchema = new Schema({
  RegNo: { type: String, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['male', 'female'] },
  phoneNumber: { type: String },
  stream: { type: String, enum: ['social', 'natural'] },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  blind: { type: String, enum: ['yes', 'no'], default: 'no' },
  schoolCode: { type: String },
  region: { type: String },
  zone: { type: String },
  city: { type: String },
  woreda: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  image: { type: String }
}, { timestamps: true });

studentSchema.pre('save', async function(next) {
  const student = this;
  if (student.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'studentId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      student.RegNo = `${counter.seq.toString().padStart(4, '0')}-G12`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Student', studentSchema);
