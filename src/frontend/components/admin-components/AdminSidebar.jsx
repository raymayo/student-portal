import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  SquareUser,
  GraduationCap,
  ChevronDown,
  CalendarDays,
  BookMarked,
  FileUser,
  Layers,
} from "lucide-react";

const DropdownMenu = ({ title, icon: Icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm transition-all hover:bg-zinc-200/50"
      >
        <span className="flex items-center gap-2">
          <Icon size={22} />
          {title}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Animated Dropdown */}
      <div
        className={`ml-6 cursor-pointer overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-40 scale-y-100 opacity-100"
            : "max-h-0 scale-y-90 opacity-0"
        }`}
      >
        <div className="mt-1 flex flex-col gap-1">{children}</div>
      </div>
    </div>
  );
};

const AdminSidebar = () => {
  return (
    <div className="h-screen w-72 border-r border-zinc-300 bg-white text-zinc-950">
      <h2 className="flex items-center gap-2 border-b border-zinc-200 px-4 py-4 text-lg font-semibold">
        <span className="bg-primary rounded-lg p-1.5">
          <GraduationCap className="text-zinc-950" size={25} />
        </span>
        Academic Portal
      </h2>

      <nav className="flex flex-col gap-2 p-4">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-all ${
              isActive ? "bg-zinc-200/50" : "hover:bg-zinc-200/50"
            }`
          }
        >
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>

        {/* Teachers Dropdown */}
        <DropdownMenu title="Teachers" icon={Users}>
          {/* <NavLink
						to="/admin/teachers"
						className="block px-3 py-1 text-sm hover:bg-zinc-200/50 rounded-md">
						Create Teachers
					</NavLink> */}
          <NavLink
            to="/admin/teacher-table"
            className="block rounded-md px-3 py-1 text-sm hover:bg-zinc-200/50"
          >
            Manage Teachers
          </NavLink>
        </DropdownMenu>

        {/* Students Dropdown */}
        <DropdownMenu title="Students" icon={SquareUser}>
          {/* <NavLink
						to="/admin/student"
						className="block px-3 py-1 text-sm hover:bg-zinc-200/50 rounded-md">
						Create Student
					</NavLink> */}
          <NavLink
            to="/admin/student-table"
            className="block rounded-md px-3 py-1 text-sm hover:bg-zinc-200/50"
          >
            Manage Students
          </NavLink>
        </DropdownMenu>

        {/* Courses Dropdown */}
        <DropdownMenu title="Courses" icon={BookMarked}>
          <NavLink
            to="/admin/courses"
            className="block rounded-md px-3 py-1 text-sm hover:bg-zinc-200/50"
          >
            Create Courses
          </NavLink>
          <NavLink
            to="/admin/courses"
            className="block rounded-md px-3 py-1 text-sm hover:bg-zinc-200/50"
          >
            Manage Courses
          </NavLink>
        </DropdownMenu>

        {/* Schedules Dropdown */}
        <DropdownMenu title="Schedules" icon={CalendarDays}>
          <NavLink
            to="/admin/manage-teacher"
            className="block rounded-md px-3 py-1 text-sm hover:bg-zinc-200/50"
          >
            Manage Schedule
          </NavLink>
          <NavLink
            to="/admin/schedules"
            className="block rounded-md px-3 py-1 text-sm hover:bg-zinc-200/50"
          >
            Create Schedule
          </NavLink>
        </DropdownMenu>

        <DropdownMenu title="Grades" icon={FileUser}>
          <NavLink
            to="/admin/grades"
            className="block rounded-md px-3 py-1 text-sm hover:bg-zinc-200/50"
          >
            Student Grades
          </NavLink>
        </DropdownMenu>
        <DropdownMenu title="Sets" icon={Layers}>
          <NavLink
            to="/admin/sets"
            className="block rounded-md px-3 py-1 text-sm hover:bg-zinc-200/50"
          >
            Create Set
          </NavLink>
        </DropdownMenu>
      </nav>
    </div>
  );
};

export default AdminSidebar;
