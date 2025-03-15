import express from "express";
import { register, login, getProfile } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register); // Register a new user
router.post("/login", login); // Log in user
router.get("/profile", authMiddleware, getProfile); // Get profile (protected)

export default router;
