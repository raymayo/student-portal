import React, { useState } from "react";
import { Plus } from 'lucide-react';
import useFetch from '../../custom-hooks/useFetch.js';
import TeacherRegistrationModal from "./TeacherRegistrationModal";
import Tooltip from "../Tooltip.jsx";


const TeacherTable = () => {

const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);



    const { data: teachers, loading, error } = useFetch("http://localhost:5000/api/users?role=teacher");

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;


    



  return (
    <div className='w-full max-w-[1000px] flex flex-col gap-4 h-full'>
       <button className='self-end border border-zinc-300 text-xs font-medium cursor-pointer px-3 py-2 rounded-md flex items-center gap-2' onClick={() => setRegisterModalOpen(true)}><Plus size={16}/>Register</button>
    <div className='border border-zinc-200 rounded-md h-fit'>
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
                                <button className='border border-zinc-300 rounded-md w-8 h-8 cursor-pointer' onClick={() => openModal(teacher)}>V</button>
                                <button className='border border-zinc-300 rounded-md w-8 h-8 cursor-pointer'>E</button>
                                <button className='border border-zinc-300 rounded-md w-8 h-8 cursor-pointer'>D</button>
                                </div>
                            </td>
                        </tr>
               ))}
            </tbody>

        </table>
    </div>

                <TeacherRegistrationModal isOpen={isRegisterModalOpen} onClose={() => setRegisterModalOpen(false)} />
    </div>
  )
}

export default TeacherTable