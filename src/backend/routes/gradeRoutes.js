import express from "express";
import { createGrade, getStudentGrades, updateGrade } from "../controllers/gradeController.js";

const router = express.Router();

router.post("/:studentId/:scheduleId", createGrade); 
router.get("/:studentId", getStudentGrades);
router.put("/:gradeId", updateGrade);

export default router;
