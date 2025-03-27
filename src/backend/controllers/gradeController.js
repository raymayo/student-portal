import Grade from "../models/Grade.js";
import User from "../models/User.js";
import Schedule from "../models/Schedule.js";
import mongoose from "mongoose";

export const createGrade = async (req, res) => {
  try {
    const { studentId, scheduleId } = req.params;

    // Check if grade already exists
    let grade = await Grade.findOne({
      student: studentId,
      schedule: scheduleId,
    });
    if (grade) {
      return res
        .status(400)
        .json({ message: "Grade document already exists." });
    }

    // ✅ Fetch the schedule to get the teacher's ID
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found." });
    }

    // ✅ Assign the teacher from the schedule
    grade = new Grade({
      student: studentId,
      schedule: scheduleId,
      teacher: schedule.teacher, // Get teacher from schedule
      course: schedule.course,
      semester: schedule.semester,
      academicYear: schedule.academicYear,
      termGrades: { prelim: null, midterm: null, finals: null },
    });

    await grade.save();

    // ✅ Update student's `grades` array in the User collection
    await User.findByIdAndUpdate(studentId, {
      $push: { grades: grade._id },
    });

    res
      .status(201)
      .json({ message: "Grade document created successfully!", grade });
  } catch (error) {
    console.error("Error creating grade:", error);
    res.status(500).json({ message: "Failed to create grade document." });
  }
};

export const getStudentGrades = async (req, res) => {
  try {
    const { studentId, scheduleId } = req.query;

    let filter = {};

    if (studentId) {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return res.status(400).json({ error: "Invalid Student ID format" });
      }
      filter.student = new mongoose.Types.ObjectId(studentId);
    }

    if (scheduleId) {
      if (!mongoose.Types.ObjectId.isValid(scheduleId)) {
        return res.status(400).json({ error: "Invalid Schedule ID format" });
      }
      filter.schedule = new mongoose.Types.ObjectId(scheduleId);
    }

    const grades = await Grade.find(filter)
      .populate({ path: "schedule", populate: { path: "course" } })
      .populate("teacher")
      .populate("student");

    if (!grades.length) {
      return res.status(404).json({ error: "No grades found" });
    }

    res.status(200).json(grades);
  } catch (error) {
    console.error("Error fetching grades:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateGrade = async (req, res) => {
  try {
    const { gradeId } = req.params; // Extract grade's ObjectId from URL
    const { prelim, midterm, finals } = req.body;

    // ✅ Find the grade by its ID
    let grade = await Grade.findById(gradeId);

    // 🛑 If the grade doesn't exist, return an error
    if (!grade) {
      return res.status(404).json({ message: "Grade document not found." });
    }

    // ✅ Ensure `termGrades` exists
    if (!grade.termGrades) {
      grade.termGrades = { prelim: 0, midterm: 0, finals: 0 };
    }

    // ✅ Update the grade safely
    grade.termGrades.prelim = prelim ?? grade.termGrades.prelim;
    grade.termGrades.midterm = midterm ?? grade.termGrades.midterm;
    grade.termGrades.finals = finals ?? grade.termGrades.finals;

    await grade.save();

    res.status(200).json({ message: "Grade updated successfully!", grade });
  } catch (error) {
    console.error("Error updating grade:", error);
    res.status(500).json({ message: "Failed to update grade document." });
  }
};
