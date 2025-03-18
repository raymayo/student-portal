import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
    phone: { type: String },
    birthday: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    address: { type: String },
    department: { type: String },







    //STUDENT ONLY
    currentSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Schedule" }], // For students only
    studentId: { type: String, unique: true, sparse: true }, // Only for students
    yearLevel:{type: String},
    // set:{type:mongoose.Schema.Types.ObjectId, ref},



    //TEACHER ONLY
    specialization: { type: String },
    teachingSchedules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Schedule" }], // For teachers only
    teacherId: { type: String, unique: true, sparse: true }, // Only for teachers
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
