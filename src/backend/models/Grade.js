import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Student's ID
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedule",
    required: true,
  }, // Subject schedule
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Teacher's ID (nullable)
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  }, // Course ID
  semester: { type: String, required: true },
  academicYear: { type: String, required: true },
  termGrades: {
    prelim: { type: Number, min: 0, max: 100, default: null },
    midterm: { type: Number, min: 0, max: 100, default: null },
    finals: { type: Number, min: 0, max: 100, default: null },
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Grade", gradeSchema);
