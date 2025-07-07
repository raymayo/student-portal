import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

const GradeViewModal = ({ isOpen, onClose, title, scheduleId }) => {
  const [students, setStudents] = useState([]);

  const getListOfGrades = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/schedule/search/${id}`,
      );
      setStudents(res.data);
      console.log(students);
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  };

  useEffect(() => {
    if (scheduleId !== null) {
      getListOfGrades(scheduleId);
    }
    const closeOnEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", closeOnEsc);
    return () => document.removeEventListener("keydown", closeOnEsc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="animate-fade-in relative h-full w-full rounded-2xl bg-white p-6 shadow-lg">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <X />
        </button>
        {title && <h2 className="mb-4 text-xl font-semibold">{title}</h2>}
        <div>
          <table className="h-full w-full">
            <thead>
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                  Name
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                  Prelim
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                  Midterm
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                  Finals
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index + 1}>
                  <td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">
                    {student.student.name}
                  </td>
                  <td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">
                    {student.termGrades?.prelim || "N/A"}
                  </td>
                  <td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">
                    {student.termGrades?.midterm || "N/A"}
                  </td>
                  <td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">
                    {student.termGrades?.finals || "N/A"}
                  </td>
                  {/* <td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">
                    <button>Edit</button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GradeViewModal;
