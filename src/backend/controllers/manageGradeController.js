
import Schedule from "../models/Schedule.js";
import Grade from "../models/Grade.js";
// eslint-disable-next-line no-unused-vars
import mongoose from "mongoose";

export const searchSchedule = async (req, res) => {
    const { query = '' } = req.query;

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
                $lookup: {
                    from: "users",
                    localField: "teacher",
                    foreignField: "_id",
                    as: "teacher",
                },
            },
            { $unwind: { path: "$teacher", preserveNullAndEmptyArrays: true } },

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

export const getGradesOnSchedule = async (req, res) => {
    const { id: scheduleId } = req.params;

    try {
        const grades = await Grade.find({ schedule: scheduleId })
            .populate('student', 'name')
            .populate('course', 'courseName courseId');

        if (!grades || grades.length === 0) {
            return res.status(404).json({ message: 'No grades found for this schedule' });
        }

        res.status(200).json(grades);
    } catch (error) {
        console.error('Error fetching grades for schedule:', error);
        res.status(500).json({ message: 'Error fetching grades for schedule', error });
    }
};
