import express from "express";
import { createGrade } from "../controllers/gradeController.js";
import { getStudentGrades } from "../controllers/gradeController.js";

const router = express.Router();

router.post("/:studentId/:scheduleId", createGrade); 
router.get("/:studentId", getStudentGrades);

export default router;
