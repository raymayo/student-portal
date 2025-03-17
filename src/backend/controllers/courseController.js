import Course from "../models/Course.js"; // Ensure this path is correct

// @desc    Create a new course
// @route   POST /api/courses
// @access  Public (or Protected, depending on your setup)
export const createCourse = async (req, res) => {
    try {
        const { courseId, courseName, courseUnit, areaOfStudy, semester, yearLevel } = req.body;

        // Validate required fields
        if (!courseId || !courseName || !courseUnit || !areaOfStudy || !semester || !yearLevel) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Check if course already exists
        const existingCourse = await Course.findOne({ courseId });
        if (existingCourse) {
            return res.status(400).json({ error: "Course ID already exists." });
        }

        // Create new course
        const newCourse = new Course({
            courseId,
            courseName,
            courseUnit,
            areaOfStudy,
            semester,
            yearLevel
        });

        // Save to database
        await newCourse.save();

        res.status(201).json({ message: "Course created successfully!", course: newCourse });
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};
