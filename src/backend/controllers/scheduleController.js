import Schedule from '../models/Schedule.js';

// Fetch all schedules with populated teacher and student details
export const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate('teacherId students', 'name email');
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching schedules' });
  }
};

// Fetch all schedules without populating (raw data)
export const getRawSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find(); // No populate, returns raw data
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching raw schedules' });
  }
};

// Create a new schedule
export const createSchedule = async (req, res) => {
  try {
    console.log("Received request body:", req.body); // Log the request body

    const newSchedule = new Schedule(req.body);
    await newSchedule.save();

    res.status(201).json(newSchedule);
  } catch (error) {
    console.error("Error creating schedule:", error); // Log backend error
    res.status(500).json({ error: error.message || 'Error creating schedule' });
  }
};


// Update a schedule
export const updateSchedule = async (req, res) => {
  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ error: 'Error updating schedule' });
  }
};

// Delete a schedule
export const deleteSchedule = async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Schedule deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting schedule' });
  }
};
