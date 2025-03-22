import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    department:{type: String, required: true },
    yearLevel:{type:String, enum: ["1", "2", "3", "4"], required: true},
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Teacher can be null initially
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    day: [{ type: String, enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], required: true }],
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
    room: { type: String, required: true }
  });

  
  export default mongoose.model("Schedule", scheduleSchema);