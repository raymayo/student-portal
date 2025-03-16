import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
    studentId: { type: String, unique: true, sparse: true }, // Only for students
    teacherId: { type: String, unique: true, sparse: true }, // Only for teachers
    phone: { type: String },
    birthday: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    address: { type: String },
    department: { type: String },
    specialization: { type: String },
    teachingSchedules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Schedule" }], // For teachers only
    currentSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Schedule" }], // For students only
}, { timestamps: true });

// Conditionally add fields based on role
userSchema.pre("save", function (next) {
    if (this.role === "student") {
        if (!this.currentSubjects) this.currentSubjects = [];
        this.teachingSchedules = undefined; // Remove if exists
    } else if (this.role === "teacher") {
        if (!this.teachingSchedules) this.teachingSchedules = [];
        this.currentSubjects = undefined; // Remove if exists
    } else {
        // Ensure admin does not have either field
        this.currentSubjects = undefined;
        this.teachingSchedules = undefined;
    }
    next();
});

export default mongoose.model("User", userSchema);
