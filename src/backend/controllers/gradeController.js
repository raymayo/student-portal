import Grade from "../models/Grade.js";
import User from "../models/User.js"; // ✅ Import User model
import mongoose from "mongoose";

export const createGrade = async (req, res) => {
    try {
        const { studentId, scheduleId } = req.params;

        // Check if grade already exists
        let grade = await Grade.findOne({ student: studentId, schedule: scheduleId });
        if (grade) {
            return res.status(400).json({ message: "Grade document already exists." });
        }

        // Create a new grade entry
        grade = new Grade({
            student: studentId,
            schedule: scheduleId,
            teacher: req.user?._id || null, // Remove middleware if not needed
            termGrades: { prelim: null, midterm: null, finals: null }
        });

        await grade.save();

        // ✅ Update student's `grades` array in the User collection
        await User.findByIdAndUpdate(studentId, {
            $push: { grades: grade._id }
        });

        res.status(201).json({ message: "Grade document created successfully!", grade });
    } catch (error) {
        console.error("Error creating grade:", error);
        res.status(500).json({ message: "Failed to create grade document." });
    }
};


export const getStudentGrades = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        // ✅ Validate if studentId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ error: "Invalid Student ID format" });
        }

        // ✅ Convert studentId to ObjectId format before querying
        const studentObjectId = new mongoose.Types.ObjectId(studentId);

        const grades = await Grade.find({ student: studentObjectId })
        .populate({
            path: "schedule",
            populate: { path: "course"}})
            .populate("teacher")
            .populate("student")


        if (!grades.length) {
            return res.status(404).json({ error: "No grades found for this student" });
        }

        res.status(200).json(grades);
    } catch (error) {
        console.error("Error fetching grades:", error); // Log the exact error
        res.status(500).json({ error: "Internal Server Error" });
    }
};