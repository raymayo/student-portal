import React, { useState } from "react";
import { Plus } from "lucide-react";
import useFetch from "../../custom-hooks/useFetch.js";
import axios from "axios";
import ScheduleModal from "./ScheduleModal.jsx"; // ✅ Importing the modal

const StudentTable = () => {
    const { data: students, loading, error } = useFetch("http://localhost:5000/api/users?role=student");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [schedules, setSchedules] = useState([]);

    // Open modal and fetch schedules based on student details
    const openModal = async (student) => {
        console.log(student._id)
        setSelectedStudent(student);
        setIsModalOpen(true);

        try {
            const yearLevel = encodeURIComponent(String(student.yearLevel).trim());
            let department = student.department.trim();

            const validDepartments = [
                "Hospitality Management",
                "Teacher Education",
                "Computer Science",
                "Business Education",
            ];

            if (!validDepartments.includes(department)) {
                console.error("Invalid department:", department);
                return;
            }

            // Fetch schedules based on student's yearLevel & department
            const response = await axios.get(
                `http://localhost:5000/api/schedules?yearLevel=${yearLevel}&department=${encodeURIComponent(department)}`
            );

            setSchedules(response.data);
        } catch (err) {
            console.error("Error fetching schedules:", err);
        }
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
        setSchedules([]);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="w-full max-w-[1000px] flex flex-col gap-4 h-full">
            <button className="self-end border border-zinc-300 text-xs font-medium cursor-pointer px-3 py-2 rounded-md flex items-center gap-2">
                <Plus size={16} />
                Register
            </button>
            <div className="border border-zinc-300 rounded-md h-fit">
                <table className="w-full h-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">#</th>
                            <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">ID</th>
                            <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">Name</th>
                            <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">Email</th>
                            <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">Department</th>
                            <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">Year Level</th>
                            <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={index}>
                                <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">{index + 1}</td>
                                <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">{student.studentId}</td>
                                <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">{student.name}</td>
                                <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">{student.email}</td>
                                <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">{student.department}</td>
                                <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">{student.yearLevel}</td>
                                <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
                                    <div className="flex gap-2">
                                        <button onClick={() => openModal(student)} className="border border-zinc-300 rounded-md w-8 h-8 cursor-pointer">
                                            V
                                        </button>
                                        <button className="border border-zinc-300 rounded-md w-8 h-8 cursor-pointer">E</button>
                                        <button className="border border-zinc-300 rounded-md w-8 h-8 cursor-pointer">D</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Component */}
            <ScheduleModal isOpen={isModalOpen} onClose={closeModal} student={selectedStudent} schedules={schedules} />
        </div>
    );
};

export default StudentTable;
