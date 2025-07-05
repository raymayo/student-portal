
import Schedule from "../models/Schedule.js";
// eslint-disable-next-line no-unused-vars
import mongoose from "mongoose";

export const searchSchedule = async (req, res) => {
    const { query = '' } = req.query;

    // const searchCriteria = {
    //     $or: [
    //         { "course.name": { $regex: query, $options: "i" } },
    //         { "teacher.name": { $regex: query, $options: "i" } },
    //         { semester: { $regex: query, $options: "i" } },
    //         { academicYear: { $regex: query, $options: "i" } },
    //     ],
    // }

    try {
        const pipeline = [
            {
                $lookup: {
                    from: "courses",
                    localField: 'course',
                    foreignField: "_id",
                    as: 'course'
                }
            },
            { $unwind: '$course' },
            {
                $match: {
                    $and: [
                        {
                            $or: [
                                { "course.courseId": { $regex: query, $options: "i" } },
                                { "course.courseName": { $regex: query, $options: "i" } },
                                { semester: { $regex: query, $options: "i" } },
                                { academicYear: { $regex: query, $options: "i" } }

                            ]
                        }
                    ]
                }
            }


        ]

        const schedules = await Schedule.aggregate(pipeline);
        res.status(200).json(schedules);
    } catch (error) {
        console.error('Search failed:', error);
        res.status(500).json({ message: 'Search failed', error });
    }
}

export const getStudentsOnSchedule = async (req, res) => {
    const { id } = req.params;

    try {
        const schedule = await Schedule.findById(id).populate('students').populate({
            path: 'teacher',
            select: 'name'
        }).populate({
            path: 'course',
            select: 'courseId courseName'
        });

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        res.status(200).json(schedule);
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ message: 'Error fetching schedule', error });
    }
};