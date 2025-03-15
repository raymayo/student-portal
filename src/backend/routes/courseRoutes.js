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

export default router;
