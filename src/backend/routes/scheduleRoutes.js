import express from "express";
import {
  getSchedules,
  getRawSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  assignTeacherToSchedules,
  getSchedulesByCriteria,
  assignSchedulesToStudent,
  getSchedulesByCourseId,
  getFilteredSchedule,
} from "../controllers/scheduleController.js";

const router = express.Router();

router.get("/", getSchedules);
router.get("/raw", getRawSchedules);
// router.get("/", getSchedulesByCriteria);

router.get("/filter", getFilteredSchedule);
router.get("/by-course", getSchedulesByCourseId);

router.post("/", createSchedule);
router.post("/:studentId/assign-schedules", assignSchedulesToStudent);

router.put("/:id/assign-teacher", assignTeacherToSchedules);
router.put("/:id", updateSchedule);
router.delete("/:id", deleteSchedule);

export default router;
