import Schedule from '../models/Schedule.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

export const getScheduleOfStudent = async (req, res) => {
    try {
        const studentId = req.params.studentId?.trim();

        console.log('Received studentId:', studentId);

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Invalid student ID format' });
        }

        // Find student and populate currentSubjects (schedules)
        const student = await User.findById(studentId) .populate({
            path: 'currentSubjects', 
            populate: [
                { path: 'course' }  // Example: Populate classroom details
            ]
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(student.currentSubjects.length ? student.currentSubjects : []);
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ message: 'Server error' });
    }
};