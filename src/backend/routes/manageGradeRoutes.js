import express from "express";
import { searchSchedule, getStudentsOnSchedule } from "../controllers/manageGradeController.js";

const router = express.Router();

router.get("/search", searchSchedule);
router.get("/search/:id", getStudentsOnSchedule);

export default router;