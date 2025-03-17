import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    courseId: { type: String, required: true }, // e.g., "Math 101"
    courseName: { type: String, required: true },
    courseUnit: { type: Number, required: true },
    areaOfStudy: { type: String, required: true }, // e.g., "Computer Science", "Engineering"
    semester: { type: String, required: true, enum: ["1st Semester", "2nd Semester", "Summer", "Januarian", "Octoberian"] }, // Restrict to valid semesters
    yearLevel: { type: Number, required: true, min: 1, max: 4 } // Assuming 1st to 4th-year courses
});

export default mongoose.model("Course", courseSchema);
