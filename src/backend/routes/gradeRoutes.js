import express from "express";
import {
  createGrade,
  getStudentGrades,
  updateGrade,
  bulkUpdateGrades
} from "../controllers/gradeController.js";

const router = express.Router();

router.put("/bulk", bulkUpdateGrades);
router.get("/:studentId", getStudentGrades);
router.put("/:gradeId", updateGrade);
router.post("/:studentId/:scheduleId", createGrade);

export default router;
