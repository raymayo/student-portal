import Schedule from '../models/Schedule.js';
import User from '../models/User.js'
import mongoose from 'mongoose';



export const getSchedules = async (req, res) => {
  const { yearLevel, department, courseId } = req.query;

  try {
      // Fetch schedules and populate the course details
      let query = {};

      if (yearLevel) {
          query["course.yearLevel"] = yearLevel.trim();
      }
      if (department) {
          query["course.department"] = department.trim().toLowerCase();
      }
      if (courseId) {
          query["course._id"] = courseId;
      }

      const schedules = await Schedule.find(query)
          .populate("course")
          .populate("teacher", "name email")
          .populate("students", "name email");

      res.json(schedules);
  } catch (error) {
      res.status(500).json({ message: "Error fetching schedules", error });
  }
};



// Fetch schedules by course ID
export const getSchedulesByCourseId = async (req, res) => {
  const { courseId } = req.query;

  if (!courseId) {
    return res.status(400).json({ message: "Course ID is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: "Invalid Course ID format" });
  }

  try {
    const schedules = await Schedule.find({
      course: new mongoose.Types.ObjectId(courseId), // Ensuring ObjectId format
    })
      .populate("course")
      .populate("teacher", "name email")
      .populate("students", "name email");

    if (schedules.length === 0) {
      return res.status(404).json({ message: "No schedules found for this course ID" });
    }

    res.status(200).json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ message: "Internal Server Error", error });
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


// Fetch schedules based on year level and area of study
export const getSchedulesByCriteria = async (req, res) => {
  try {
    const { yearLevel, areaOfStudy } = req.query;

    if (!yearLevel || !areaOfStudy) {
      return res.status(400).json({ message: "Missing yearLevel or areaOfStudy" });
    }

    const schedules = await Schedule.find({ yearLevel, areaOfStudy });

    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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




// Assign multiple schedules to a student
export const assignSchedulesToStudent = async (req, res) => {
  try {
      const { studentId } = req.params;
      const { scheduleIds } = req.body;

      console.log("Received Schedule IDs:", scheduleIds);

      if (!Array.isArray(scheduleIds) || scheduleIds.length === 0) {
          return res.status(400).json({ message: "No schedules selected" });
      }

      const student = await User.findById(studentId);
      if (!student) {
          return res.status(404).json({ message: "Student not found" });
      }

      if (student.role !== "student") {
          return res.status(400).json({ message: "User is not a student" });
      }

      // 🔥 **Filter schedules to avoid duplicates**
      const existingScheduleIds = student.currentSubjects.map(id => id.toString()); // Convert to string for comparison
      const newSchedules = scheduleIds.filter(id => !existingScheduleIds.includes(id.toString())); // Only add new schedules

      if (newSchedules.length === 0) {
          return res.status(400).json({ message: "Selected schedules are already assigned." });
      }

      // **Assign only new schedules**
      student.currentSubjects.push(...newSchedules.map(id => new mongoose.Types.ObjectId(id)));

      await student.save();
      console.log("Updated Student Data:", student);

      res.status(200).json({ message: "Schedules assigned successfully!", student });
  } catch (error) {
      console.error("Error assigning schedules:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};



// export const getFilteredSchedule = async (req, res) => {

//   const {  } = req.query;

// }


