const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  department: { type: String, required: false },
  role: { type: String, enum: ['admin'], default: 'admin' },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', adminSchema);
