import express from 'express';
import { 
    getSchedules, 
    getRawSchedules, 
    createSchedule, 
    updateSchedule, 
    deleteSchedule, 
    assignTeacherToSchedule 
  } from "../controllers/scheduleController.js";

const router = express.Router();

router.get('/', getSchedules);
router.get('/raw', getRawSchedules); 
router.post('/', createSchedule);
router.put("/:id/assign-teacher", assignTeacherToSchedule); 
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);


export default router;
