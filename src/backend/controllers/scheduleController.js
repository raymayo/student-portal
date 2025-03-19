import Schedule from '../models/Schedule.js';
import User from '../models/User.js'



export const getSchedules = async (req, res) => {
  const { yearLevel, department } = req.query;

  try {
      // Fetch schedules and populate the course details
      const schedules = await Schedule.find()
          .populate({
              path: "course",
              // select: "yearLevel department courseame",
          })
          .populate("teacher", "name email") // Populate teacher details
          .populate("students", "name email"); // Populate student details

      // Ensure yearLevel is treated consistently
      const filteredSchedules = schedules.filter(schedule => {
          if (!schedule.course) return false; // Ensure course exists

          const courseYearLevel = String(schedule.course.yearLevel); // Convert to string for comparison
          const courseDepartment = schedule.course.department?.trim().toLowerCase(); // Normalize for comparison

          return (
              (!yearLevel || courseYearLevel === yearLevel.trim()) &&
              (!department || courseDepartment === department.trim().toLowerCase())
          );
      });

      res.json(filteredSchedules);
  } catch (error) {
      res.status(500).json({ message: "Error fetching schedules", error });
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
      const newTeacher = await User.findById(teacherId);
      if (!newTeacher || newTeacher.role !== 'teacher') {
          return res.status(400).json({ error: 'Invalid teacher selected' });
      }

      // If schedule already has a teacher, remove it from the old teacher's `teachingSchedules`
      if (schedule.teacher) {
          const oldTeacher = await User.findById(schedule.teacher);
          if (oldTeacher) {
              oldTeacher.teachingSchedules = oldTeacher.teachingSchedules.filter(schedId => schedId.toString() !== id);
              await oldTeacher.save();
          }
      }

      // Assign new teacher to schedule
      schedule.teacher = teacherId;
      await schedule.save();

      // ✅ Ensure new teacher has this schedule in their `teachingSchedules`
      if (!newTeacher.teachingSchedules.includes(id)) {
          newTeacher.teachingSchedules.push(id);
          await newTeacher.save();
      }

      res.json({ message: 'Teacher reassigned successfully', schedule, newTeacher });
  } catch (error) {
      console.error('Server Error:', error);
      res.status(500).json({ error: 'Error reassigning teacher' });
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
