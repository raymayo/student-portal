import { Routes, Route } from "react-router-dom";
import ScheduleForm from "./ScheduleForm";
import TeacherRegistration from "./TeacherRegistration.jsx";
import AssignTeacherForm from "./AssignTeacherForm.jsx";
import AddCourseForm from "./AddCourseForm.jsx";
import StudentRegistration from "./StudentRegistration.jsx";

const AdminRoutes = ({ fetchSchedules }) => {
  return (
    <Routes>
      <Route path="/dashboard" element={<h1>Admin Dashboard</h1>} />
      <Route path="/schedules" element={<ScheduleForm />} />
      <Route path="/teachers" element={<TeacherRegistration />} />
      <Route path="/assign-teacher" element={<AssignTeacherForm />} />
      <Route path="/courses" element={<AddCourseForm />} />
      <Route path="/student" element={<StudentRegistration />} />
    </Routes>
  );
};

export default AdminRoutes;
