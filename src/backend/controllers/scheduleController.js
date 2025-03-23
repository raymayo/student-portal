import Schedule from '../models/Schedule.js';
import User from '../models/User.js'
import mongoose from 'mongoose';



export const getSchedules = async (req, res) => {
  const { yearLevel, department, courseId, teacher } = req.query;

  try {
    let query = {};

    if (yearLevel) {
      query["yearLevel"] = yearLevel.trim();
    }
    if (department) {
      query["department"] = department.trim().toLowerCase();
    }
    if (courseId) {
      query["course"] = new mongoose.Types.ObjectId(courseId);
    }
    if (teacher !== undefined && teacher !== null && teacher !== "") {
      query["teacher"] = new mongoose.Types.ObjectId(teacher);
    } else {
      query["teacher"] = { $ne: null, $exists: true };
    }

    const schedules = await Schedule.find(query)
      .populate("course")
      .populate("students", "name yearLevel grades");

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


export const getFilteredSchedule = async (req, res) => {
  try {
    const { yearLevel, areaOfStudy, department } = req.query;

    const query = {};
    if (yearLevel) query.yearLevel = yearLevel;
    if (department) query.department = decodeURIComponent(department).trim(); // Fix encoding
    console.log("MongoDB Query:", query);

    let schedules = await Schedule.find(query).populate("course").populate("teacher", "name");

    console.log("Populated Schedules:", schedules);

    if (areaOfStudy) {
      schedules = schedules.filter(schedule => schedule.course?.areaOfStudy === areaOfStudy);
    }

    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: "Error fetching schedules", error: err.message });
  }
};









// Assign a teacher to a schedule
export const assignTeacherToSchedules = async (req, res) => {
  try {
      console.log('Request Body:', req.body);
      console.log('Request Params:', req.params);

      const { id: teacherId } = req.params; // Get teacherId from URL params
      const { scheduleIds } = req.body; // Expect an array of schedule IDs

      if (!teacherId || !Array.isArray(scheduleIds) || scheduleIds.length === 0) {
          return res.status(400).json({ error: 'Teacher ID and schedule IDs are required' });
      }

      // Check if teacher exists and has the correct role
      const teacher = await User.findById(teacherId);
      if (!teacher || teacher.role !== 'teacher') {
          return res.status(400).json({ error: 'Invalid teacher selected' });
      }

      // Fetch all schedules that match the given IDs
      const schedules = await Schedule.find({ _id: { $in: scheduleIds } });

      if (schedules.length === 0) {
          return res.status(404).json({ error: 'No schedules found' });
      }

      // Remove old teacher assignments if necessary
      for (const schedule of schedules) {
          if (schedule.teacher) {
              const oldTeacher = await User.findById(schedule.teacher);
              if (oldTeacher) {
                  oldTeacher.teachingSchedules = oldTeacher.teachingSchedules.filter(
                      (schedId) => !scheduleIds.includes(schedId.toString())
                  );
                  await oldTeacher.save();
              }
          }

          // Assign new teacher
          schedule.teacher = teacherId;
          await schedule.save();
      }

      // ✅ Ensure teacher has all new schedules in their `teachingSchedules`
      teacher.teachingSchedules = [...new Set([...teacher.teachingSchedules, ...scheduleIds])];
      await teacher.save();

      res.json({ message: 'Teacher assigned successfully to multiple schedules', schedules, teacher });
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


      await Schedule.updateMany(
        { _id: { $in: newSchedules } },
        { $addToSet: { students: studentId } } // Avoids duplicate student entries
    );

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


