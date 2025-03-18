import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
	LayoutDashboard,
	Users,
	BookOpen,
	Calendar,
	GraduationCap,
	ChevronDown,
} from 'lucide-react';

const DropdownMenu = ({ title, icon: Icon, children }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-all hover:bg-zinc-200/50 cursor-pointer">
				<span className="flex items-center gap-2">
					<Icon size={20} />
					{title}
				</span>
				<ChevronDown
					size={16}
					className={`transition-transform duration-300 ${
						isOpen ? 'rotate-180' : ''
					}`}
				/>
			</button>

			{/* Animated Dropdown */}
			<div
				className={`ml-6 overflow-hidden transition-all duration-300 ease-in-out cursor-pointer ${
					isOpen
						? 'max-h-40 opacity-100 scale-y-100'
						: 'max-h-0 opacity-0 scale-y-90'
				}`}>
				<div className="flex flex-col gap-1 mt-1">{children}</div>
			</div>
		</div>
	);
};

const AdminSidebar = () => {
	return (
		<div className="h-screen w-72 bg-zinc-100/50 text-zinc-950 p-4 border-r border-zinc-300">
			<h2 className="text-xl font-semibold mb-4 flex gap-2 items-center">
				<span className="border p-1.5 rounded-lg bg-zinc-950">
					<GraduationCap className="text-zinc-100" size={25} />
				</span>
				Acadex
			</h2>

			<nav className="flex flex-col gap-2">
				<NavLink
					to="/admin/dashboard"
					className={({ isActive }) =>
						`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all ${
							isActive ? 'bg-zinc-200/50' : 'hover:bg-zinc-200/50'
						}`
					}>
					<LayoutDashboard size={20} /> Dashboard
				</NavLink>

				{/* Teachers Dropdown */}
				<DropdownMenu title="Teachers" icon={Users}>
					<NavLink
						to="/admin/teachers"
						className="block px-3 py-1 text-sm hover:bg-zinc-200/50 rounded-md">
						Create Teachers
					</NavLink>
					<NavLink
						to="/admin/teacher-table"
						className="block px-3 py-1 text-sm hover:bg-zinc-200/50 rounded-md">
						Manage Teachers
					</NavLink>
				</DropdownMenu>

				{/* Students Dropdown */}
				<DropdownMenu title="Students" icon={GraduationCap}>
					<NavLink
						to="/admin/student"
						className="block px-3 py-1 text-sm hover:bg-zinc-200/50 rounded-md">
						Create Student
					</NavLink>
					<NavLink
						to="/admin/student-table"
						className="block px-3 py-1 text-sm hover:bg-zinc-200/50 rounded-md">
						Manage Students
					</NavLink>
				</DropdownMenu>

				{/* Courses Dropdown */}
				<DropdownMenu title="Courses" icon={BookOpen}>
					<NavLink
						to="/admin/courses"
						className="block px-3 py-1 text-sm hover:bg-zinc-200/50 rounded-md">
						Create Courses
					</NavLink>
          <NavLink
						to="/admin/courses"
						className="block px-3 py-1 text-sm hover:bg-zinc-200/50 rounded-md">
						Manage Courses
					</NavLink>
				</DropdownMenu>

				{/* Schedules Dropdown */}
				<DropdownMenu title="Schedules" icon={Calendar}>
					<NavLink
						to="/admin/assign-teacher"
						className="block px-3 py-1 text-sm hover:bg-zinc-200/50 rounded-md">
						Assign Schedule
					</NavLink>
					<NavLink
						to="/admin/schedules"
						className="block px-3 py-1 text-sm hover:bg-zinc-200/50 rounded-md">
						Create Schedule
					</NavLink>
				</DropdownMenu>
			</nav>
		</div>
	);
};

export default AdminSidebar;
