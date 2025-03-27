import express from "express";
import Course from "../models/Course.js"; // Ensure correct model path

const router = express.Router();

// Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses" });
  }
});

// Create a new course
router.post("/", async (req, res) => {
  try {
    const {
      courseId,
      courseName,
      courseUnit,
      areaOfStudy,
      semester,
      yearLevel,
    } = req.body;

    // Validate required fields
    if (
      !courseId ||
      !courseName ||
      !courseUnit ||
      !areaOfStudy ||
      !semester ||
      !yearLevel
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if course already exists
    const existingCourse = await Course.findOne({ courseId });
    if (existingCourse) {
      return res.status(400).json({ error: "Course ID already exists." });
    }

    // Create new course (department will be auto-assigned by Mongoose middleware)
    const newCourse = new Course({
      courseId,
      courseName,
      courseUnit,
      areaOfStudy,
      semester,
      yearLevel,
    });

    // Save to database
    await newCourse.save();

    res
      .status(201)
      .json({ message: "Course created successfully!", course: newCourse });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Get courses with filters
router.get("/filter", async (req, res) => {
  try {
    const { yearLevel, areaOfStudy, department } = req.query;

    // Build query object based on provided filters
    const query = {};
    if (yearLevel) query.yearLevel = yearLevel;
    if (areaOfStudy) query.areaOfStudy = areaOfStudy;
    if (department) query.department = department;

    // Fetch courses from the database
    const courses = await Course.find(query);

    res.status(200).json({ courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
