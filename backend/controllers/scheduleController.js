const Schedule = require('../models/Schedule');

// Create a new schedule
exports.createSchedule = async (req, res) => {
  try {
    const { event, description, date, location } = req.body;
    if (!event || !date) {
      return res.status(400).json({ message: 'Event and date are required' });
    }

    const newSchedule = new Schedule({ event, description, date, location });
    await newSchedule.save();
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(500).json({ message: 'Error creating schedule', error: error.message });
  }
};

// Get all schedules
exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedules', error: error.message });
  }
};

// Get a single schedule by ID
exports.getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedule', error: error.message });
  }
};

// Update a schedule by ID
exports.updateSchedule = async (req, res) => {
  try {
    const { event, description, date, location } = req.body;
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { event, description, date, location },
      { new: true, runValidators: true }
    );
    if (!updatedSchedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.status(200).json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ message: 'Error updating schedule', error: error.message });
  }
};

// Delete a schedule by ID
exports.deleteSchedule = async (req, res) => {
  try {
    const deletedSchedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!deletedSchedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.status(200).json({ message: 'Schedule deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting schedule', error: error.message });
  }
};
