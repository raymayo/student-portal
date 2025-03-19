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

        // STUDENT ONLY
        currentSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Schedule", default: [] }],
        studentId: { type: String, unique: true, sparse: true }, // Only for students
        yearLevel: { type: String, required: true, enum: ["1", "2", "3", "4"] },
        areaOfStudy: { type: String },

        // TEACHER ONLY
        department: { type: String }, // Auto-filled for students based on areaOfStudy
        specialization: { type: String },
        teachingSchedules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Schedule", default: [] }], // Default empty array
        teacherId: { type: String, unique: true, sparse: true }, // Only for teachers
    },
    { timestamps: true }
);

// Middleware to auto-assign department for students
userSchema.pre("save", function (next) {
    if (this.isModified("areaOfStudy") || this.isNew) {
        if (this.role === "student") {
            this.department = areaToDepartmentMap[this.areaOfStudy] || "";
        }
    }

    // Remove student-only fields for teachers
    if (this.role === "teacher") {
        this.currentSubjects = undefined;
    }

    next();
});

export default mongoose.model("User", userSchema);
