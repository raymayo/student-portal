import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
    studentId: { type: String, unique: true, sparse: true }, // Only for students
    teacherId: { type: String, unique: true, sparse: true }, // Only for teachers
}, { timestamps: true });

export default mongoose.model("User", userSchema);
