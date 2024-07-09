const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const readingMaterialRoutes = require('./routes/readingMaterialRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const examResultRoutes = require('./routes/examResultRoutes');
const reportRouter = require('./routes/reportRoute');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', adminRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/reading-materials', readingMaterialRoutes);
app.use('/admin', adminRoutes);
app.use('/student', studentRoutes);
app.use('/visitor', visitorRoutes);
app.use('/api/examResults', examResultRoutes);
app.use('/api/reports', reportRouter);

// MongoDB Connection
const PORT = process.env.PORT || 7000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB', error);
  });
