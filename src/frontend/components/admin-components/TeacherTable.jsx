import React, { useState } from "react";
import { Plus, CalendarPlus } from 'lucide-react';
import useFetch from '../../custom-hooks/useFetch.js';
import TeacherRegistrationModal from "./TeacherRegistrationModal";
import AssignTeacherModal from "./AssignTeacherModal.jsx";
import Tooltip from "../Tooltip.jsx";


const TeacherTable = () => {

const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

    const { data: teachers, loading, error } = useFetch("http://localhost:5000/api/users?role=teacher");

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
    <div className='w-full max-w-[1000px] flex flex-col gap-4 h-full'>
       <button className='bg-white self-end border border-zinc-300 text-xs font-medium cursor-pointer px-3 py-2 rounded-md flex items-center gap-2' onClick={() => setRegisterModalOpen(true)}><Plus size={16}/>Register</button>
    <div className='border border-zinc-200 rounded-md h-fit bg-white'>
        <table className='w-full h-full '>
            <thead>
                <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">#</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">ID</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">Name</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">Email</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">Department</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">Specialization</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">Actions</th>

                </tr>
            </thead>
            <tbody>
                {teachers.map((teacher, index) => (
                        <tr key={index}>
                            <td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">{index + 1}</td>
                            <td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">{teacher.teacherId}</td>
                            <td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">{teacher.name}</td>
                            <td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">{teacher.email}</td>
                            <td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">{teacher.department}</td>
                            <td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">{teacher.specialization}</td>
                            <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
                                <div className='flex gap-2'>
                                    <Tooltip text="Assign Schedule" position="top">
                                <button className="border border-zinc-300 rounded-md cursor-pointer p-2 hover:bg-zinc-100 transition-all duration-200 shadow-2xs" onClick={() => openModal(teacher)}><CalendarPlus size={16} className="text-zinc-900" /></button>
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
                <AssignTeacherModal isOpen={isModalOpen} onClose={closeModal} teacher={selectedTeacher} />
                <TeacherRegistrationModal isOpen={isRegisterModalOpen} onClose={() => setRegisterModalOpen(false)} />
    </div>
  )
}

export default TeacherTable