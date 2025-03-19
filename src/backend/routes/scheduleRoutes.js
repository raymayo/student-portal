import express from 'express';
import { 
    getSchedules, 
    getRawSchedules, 
    createSchedule, 
    updateSchedule, 
    deleteSchedule, 
    assignTeacherToSchedule,
    getSchedulesByCriteria,
    assignSchedulesToStudent,
    getSchedulesByCourseId
  } from "../controllers/scheduleController.js";

const router = express.Router();

router.get('/', getSchedules);
router.get('/raw', getRawSchedules); 
router.get("/", getSchedulesByCriteria);


router.get('/by-course', getSchedulesByCourseId);




router.post('/', createSchedule);
router.post("/:studentId/assign-schedules", assignSchedulesToStudent);

router.put("/:id/assign-teacher", assignTeacherToSchedule); 
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);



export default router;
