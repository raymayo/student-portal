import { Routes, Route } from "react-router-dom";
import ScheduleForm from "../components/ScheduleForm";
import TeacherRegistration from "../components/TeacherRegistration";
import AssignTeacherForm from "../components/AssignTeacherForm";
import AddCourseForm from "../components/AddCourseForm";

const AdminRoutes = ({ fetchSchedules }) => {
  return (
    <Routes>
      <Route path="/dashboard" element={<h1>Admin Dashboard</h1>} />
      <Route path="/schedules" element={<ScheduleForm />} />
      <Route path="/teachers" element={<TeacherRegistration />} />
      <Route path="/assign-teacher" element={<AssignTeacherForm />} />
      <Route path="/courses" element={<AddCourseForm />} />
    </Routes>
  );
};

export default AdminRoutes;
