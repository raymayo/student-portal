import express from "express";
import User from "../models/User.js"; // Ensure correct model path

const router = express.Router();

// Get users by role
router.get("/", async (req, res) => {
  const { role } = req.query; // Extract role from query params
  try {
    const users = role ? await User.find({ role }) : await User.find(); // Filter by role if provided
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});
export default router;
