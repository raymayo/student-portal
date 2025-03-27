import mongoose from "mongoose";

const setSchema = new mongoose.Schema({
  name: { type: String, required: true },
  yearLevel: { type: Number, required: true },
  department: { type: String, required: true },
  areaOfStudy: { type: String, required: true },
  schedules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Schedule" }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model("Set", setSchema);
