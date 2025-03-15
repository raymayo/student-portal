import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User",}, // Fixed ref to User
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Fixed ref to User
    day: { type: String, enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], required: true },
    startTime: { type: Number, required: true }, // e.g., 1000
    endTime: { type: Number, required: true }, // e.g., 1030
    room: { type: String, required: true }, // e.g., "101"
});

export default mongoose.model("Schedule", scheduleSchema);
