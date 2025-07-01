import { Routes, Route } from "react-router-dom";
import ScheduleForm from "./ScheduleForm";
import AssignTeacherForm from "./AssignTeacherForm.jsx";
import AddCourseForm from "./AddCourseForm.jsx";
import TeacherTable from "./TeacherTable.jsx";
import StudentTable from "./StudentTable.jsx";
import SetCreationForm from "./SetCreationForm.jsx";

const AdminRoutes = ({ fetchSchedules }) => {
  return (
    <Routes>
      <Route path="/dashboard" element={<h1>Admin Dashboard</h1>} />
      <Route path="/schedules" element={<ScheduleForm />} />
      <Route path="/manage-teacher" element={<AssignTeacherForm />} />
      <Route path="/courses" element={<AddCourseForm />} />
      <Route path="/teacher-table" element={<TeacherTable />} />
      <Route path="/student-table" element={<StudentTable />} />
      <Route path="/sets" element={<SetCreationForm />} />
    </Routes>
  );
};

export default AdminRoutes;
