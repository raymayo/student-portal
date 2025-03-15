import express from 'express';
import { getSchedules, getRawSchedules, createSchedule, updateSchedule, deleteSchedule } from '../controllers/scheduleController.js';

const router = express.Router();

router.get('/', getSchedules);
router.get('/raw', getRawSchedules); // New route for raw schedules
router.post('/', createSchedule);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

export default router;
