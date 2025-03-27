import express from "express";
import { createSet } from "../controllers/setController.js";

const router = express.Router();

// Route to create a set and add schedules
router.post("/", createSet);

export default router;
