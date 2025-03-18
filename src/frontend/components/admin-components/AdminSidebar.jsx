import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, BookOpen, Calendar, LogOut } from "lucide-react";

const AdminSidebar = () => {
  return (
    <div className="h-screen w-72 bg-white text-zinc-950 p-5 border-r border-zinc-300">
      <h2 className="text-xl font-semibold mb-6">Admin Panel</h2>

      <nav className="flex flex-col gap-2">
        <NavLink to="/admin/dashboard" className={({ isActive }) => `flex items-center gap-2 p-3 text-base rounded-md transition-all ${isActive ? "bg-zinc-200/50" : "hover:bg-zinc-200/50"}`}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>

        <NavLink to="/admin/schedules" className={({ isActive }) => `flex items-center gap-2 p-3 text-base rounded-md transition-all ${isActive ? "bg-zinc-200/50" : "hover:bg-zinc-200/50"}`}>
          <Calendar size={20} /> Create Schedule
        </NavLink>

        <NavLink to="/admin/teachers" className={({ isActive }) => `flex items-center gap-2 p-3 text-base rounded-md transition-all ${isActive ? "bg-zinc-200/50" : "hover:bg-zinc-200/50"}`}>
          <Users size={20} /> Create Teachers
        </NavLink>

        <NavLink to="/admin/assign-teacher" className={({ isActive }) => `flex items-center gap-2 p-3 text-base rounded-md transition-all ${isActive ? "bg-zinc-200/50" : "hover:bg-zinc-200/50"}`}>
          <BookOpen size={20} /> Assign Teachers
        </NavLink>
        <NavLink to="/admin/courses" className={({ isActive }) => `flex items-center gap-2 p-3 text-base rounded-md transition-all ${isActive ? "bg-zinc-200/50" : "hover:bg-zinc-200/50"}`}>
          <BookOpen size={20} /> Manage Courses
        </NavLink>
        <NavLink to="/admin/student" className={({ isActive }) => `flex items-center gap-2 p-3 text-base rounded-md transition-all ${isActive ? "bg-zinc-200/50" : "hover:bg-zinc-200/50"}`}>
          <BookOpen size={20} /> Manage Student
        </NavLink>

        {/* <button className="flex items-center gap-2 p-3 rounded-md bg-red-600 hover:bg-red-700 transition-all">
          <LogOut size={20} /> Logout
        </button> */}
      </nav>
    </div>
  );
};

export default AdminSidebar;
