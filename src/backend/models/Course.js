import mongoose from "mongoose";

const areaToDepartmentMap = {
    "BSBA HRM": "Business Education",
    "BSBA FM": "Business Education",
    "BSA": "Business Education",
    "BSCS": "Computer Science",
    "BSED MATH & FIL": "Teacher Education",
    "BSED SOCSTUD": "Teacher Education",
    "BEED": "Teacher Education",
    "CPE": "Teacher Education",
    "BSHM": "Hospitality Management"
};

const courseSchema = new mongoose.Schema({
    courseId: { type: String, required: true }, // e.g., "Math 101"
    courseName: { type: String, required: true },
    courseUnit: { type: Number, required: true },
    areaOfStudy: { type: String, required: true }, // e.g., "Computer Science", "Engineering"
    department: { type: String, },
    semester: { 
        type: String, 
        required: true, 
        enum: ["1st Semester", "2nd Semester", "Summer", "Januarian", "Octoberian"] 
    }, // Restrict to valid semesters
    yearLevel: { type: String, required: true,enum: ["1", "2", "3", "4"]} // Assuming 1st to 4th-year courses
});

// Middleware to auto-assign department based on areaOfStudy
courseSchema.pre("save", function (next) {
    if (this.areaOfStudy) {
        this.department = areaToDepartmentMap[this.areaOfStudy] || "";
    }
    next();
});

export default mongoose.model("Course", courseSchema);
