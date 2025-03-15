import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    courseId: { type: String, required: true }, // e.g., "Math 101"
    courseName: { type: String, required: true },
    courseUnit:{type: Number, required: true}
});

export default mongoose.model("Course", courseSchema);
