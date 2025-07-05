import express from "express";
import { searchSchedule, getGradesOnSchedule } from "../controllers/manageGradeController.js";

const router = express.Router();

router.get("/search", searchSchedule);
router.get("/search/:id", getGradesOnSchedule);

export default router;