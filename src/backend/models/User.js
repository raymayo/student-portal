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

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
        phone: { type: String },
        birthday: { type: Date },
        gender: { type: String, enum: ["Male", "Female", "Other"] },
        address: { type: String },
        department: { type: String }, // Auto-filled for students based on areaOfStudy

        // STUDENT ONLY
        currentSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Schedule", default: [] }],
        studentId: { type: String, unique: true, sparse: true }, // Only for students
        yearLevel: { 
            type: String, 
            enum: ["1", "2", "3", "4"],
            required: function () {
                return this.role === "student";  // ✅ Only required for students
            }
        },
        areaOfStudy: { type: String },
        grades: [{ type: mongoose.Schema.Types.ObjectId, ref: "Grade", default: [] }],

        // TEACHER ONLY
        specialization: { type: String },
        teachingSchedules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Schedule", default: [] }], // Default empty array
        teacherId: { type: String, unique: true, sparse: true }, // Only for teachers
    },
    { timestamps: true }
);

// Middleware to auto-assign department for students
userSchema.pre("save", function (next) {
    if (this.role === "student" && this.areaOfStudy) {
        this.department = areaToDepartmentMap[this.areaOfStudy] || "";
        this.teachingSchedules = undefined;
    } else if (this.role === "teacher") {
        if (!this.teachingSchedules) this.teachingSchedules = [];
        this.currentSubjects = undefined; // Remove student-only fields
    } else {
        this.currentSubjects = undefined;
        this.teachingSchedules = undefined;
    }
    next();
});

export default mongoose.model("User", userSchema);
