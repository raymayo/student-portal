import React, { useState } from "react";
import { Plus, CalendarPlus } from "lucide-react";
import useFetch from "../../custom-hooks/useFetch.js";
import TeacherRegistrationModal from "./TeacherRegistrationModal";
import AssignTeacherModal from "./AssignTeacherModal.jsx";
import Tooltip from "../Tooltip.jsx";

const TeacherTable = () => {
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const {
    data: teachers,
    loading,
    error,
  } = useFetch("http://localhost:5000/api/users?role=teacher");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const openModal = async (teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTeacher(null);
  };

  return (
    <div className="flex h-full w-full max-w-[1000px] flex-col gap-4">
      <button
        className="flex cursor-pointer items-center gap-2 self-end rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-medium"
        onClick={() => setRegisterModalOpen(true)}
      >
        <Plus size={16} />
        Register
      </button>
      <div className="h-fit rounded-md border border-zinc-200 bg-white">
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
                Department
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Specialization
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr key={index}>
                <td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">
                  {index + 1}
                </td>
                <td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">
                  {teacher.teacherId}
                </td>
                <td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">
                  {teacher.name}
                </td>
                <td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">
                  {teacher.email}
                </td>
                <td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">
                  {teacher.department}
                </td>
                <td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">
                  {teacher.specialization}
                </td>
                <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
                  <div className="flex gap-2">
                    <Tooltip text="Assign Schedule" position="top">
                      <button
                        className="cursor-pointer rounded-md border border-zinc-300 p-2 shadow-2xs transition-all duration-200 hover:bg-zinc-100"
                        onClick={() => openModal(teacher)}
                      >
                        <CalendarPlus size={16} className="text-zinc-900" />
                      </button>
                    </Tooltip>
                    {/* <button className='border border-zinc-300 rounded-md w-8 h-8 cursor-pointer'>E</button>
                                <button className='border border-zinc-300 rounded-md w-8 h-8 cursor-pointer'>D</button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AssignTeacherModal
        isOpen={isModalOpen}
        onClose={closeModal}
        teacher={selectedTeacher}
      />
      <TeacherRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />
    </div>
  );
};

export default TeacherTable;
