import React, { useState } from "react";
import { Plus, CalendarPlus } from "lucide-react";
import useFetch from "../../custom-hooks/useFetch.js";
import axios from "axios";
import ScheduleModal from "./ScheduleModal.jsx"; // ✅ Importing the modal
import StudentRegistrationModal from "./StudentRegistrationModal";

import Tooltip from "../Tooltip.jsx";

const StudentTable = () => {
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const {
    data: students,
    loading,
    error,
  } = useFetch("http://localhost:5000/api/users?role=student");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [schedules, setSchedules] = useState([]);

  // Open modal and fetch schedules based on student details
  const openModal = async (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);

    try {
      const yearLevel = encodeURIComponent(String(student.yearLevel).trim());
      let areaOfStudy = student.areaOfStudy.trim();

      // Fetch schedules based on student's yearLevel & department
      const response = await axios.get(
        `http://localhost:5000/api/schedules?yearLevel=${yearLevel}&areaOfStudy=${areaOfStudy}`,
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
    <div className="flex h-full w-full max-w-[1000px] flex-col gap-4">
      <button
        className="flex cursor-pointer items-center gap-2 self-end rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-medium"
        onClick={() => setRegisterModalOpen(true)}
      >
        <Plus size={16} />
        Register
      </button>
      <div className="h-fit rounded-md border border-zinc-300 bg-white">
        <table className="h-full w-full">
          <thead>
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                #
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                ID
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Name
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Email
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Course
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Year Level
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
                  {index + 1}
                </td>
                <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
                  {student.studentId}
                </td>
                <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
                  {student.name}
                </td>
                <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
                  {student.email}
                </td>
                <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
                  {student.areaOfStudy}
                </td>
                <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
                  {student.yearLevel}
                </td>
                <td className="w-fit border-t border-zinc-300 px-4 py-3 text-left text-sm">
                  <div className="flex gap-2">
                    <Tooltip text="Assign Schedule" position="top">
                      <button
                        onClick={() => openModal(student)}
                        className="cursor-pointer rounded-md border border-zinc-300 p-2 shadow-2xs transition-all duration-200 hover:bg-zinc-100"
                      >
                        <CalendarPlus size={16} className="text-zinc-900" />
                      </button>
                    </Tooltip>
                    {/* <button className="border border-zinc-300 rounded-md cursor-pointer">E</button>
                                        <button className="border border-zinc-300 rounded-md cursor-pointer">D</button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Component */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={closeModal}
        student={selectedStudent}
        schedules={schedules}
      />
      <StudentRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />
    </div>
  );
};

export default StudentTable;
