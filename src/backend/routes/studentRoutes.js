import express from 'express';
import { getScheduleOfStudent } from '../controllers/studentController.js';

const router = express.Router();

console.log("Student routes loaded");  // Debug log

router.get('/schedule/:studentId', (req, res, next) => {
    console.log("Schedule route hit with studentId:", req.params.studentId);
    next();
}, getScheduleOfStudent);

export default router;
