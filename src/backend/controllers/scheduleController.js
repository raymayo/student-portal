import Schedule from '../models/Schedule.js';
import User from '../models/User.js'

// Fetch all schedules with populated teacher and student details
export const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate('teacher students', 'name email');
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching schedules' });
  }
};

// Fetch all schedules without populating (raw data)
export const getRawSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate("course"); // ✅ Populate course details
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: "Error fetching raw schedules" });
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






// Assign a teacher to a schedule
export const assignTeacherToSchedule = async (req, res) => {
  try {
      console.log('Request Body:', req.body);
      console.log('Request Params:', req.params);

      const { teacherId } = req.body;
      const { id } = req.params; // Schedule ID from URL

      if (!teacherId) {
          return res.status(400).json({ error: 'Teacher ID is required' });
      }

      // Check if schedule exists
      const schedule = await Schedule.findById(id);
      if (!schedule) {
          return res.status(404).json({ error: 'Schedule not found' });
      }

      // Check if teacher exists and has the correct role
      const teacher = await User.findById(teacherId);
      if (!teacher || teacher.role !== 'teacher') {
          return res.status(400).json({ error: 'Invalid teacher selected' });
      }

      // Update schedule with the teacher
      schedule.teacher = teacherId;
      await schedule.save();

      res.json({ message: 'Teacher assigned successfully', schedule });
  } catch (error) {
      console.error('Server Error:', error);
      res.status(500).json({ error: 'Error assigning teacher' });
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
