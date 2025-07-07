import React, { useState } from "react";
import useFormatTime from "../../custom-hooks/useFormatTime.js";
import GradeViewModal from "../admin-components/GradeViewModal.jsx";

import { SquarePen, Eye } from "lucide-react";
import axios from "axios";
import GradeEditModal from "../admin-components/GradeEditModal.jsx";

const GradeTable = () => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [search, setSearch] = useState("");
  const [schedule, setSchedule] = useState([]);

  const { formatTime } = useFormatTime();

  const fetchSchedule = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/schedule/search?query=${search}`,
      );
      setSchedule(res.data);
      console.log(schedule);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
  };

  const openViewModal = (id) => {
    setSelectedScheduleId(id);
    setViewModalOpen(true);
  };

  const openEditModal = (id) => {
    setSelectedScheduleId(id);
    setEditModalOpen(true);
  };

  return (
    <div className="h-full w-full">
      <nav className="m-auto flex max-w-xl gap-2 p-4">
        <input
          className="w-full rounded-md border border-zinc-300 px-2 py-1"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Course ID or Description"
        />
        <button
          className="rounded-md border bg-zinc-900 px-2 py-1.5 text-white"
          onClick={fetchSchedule}
        >
          Search
        </button>
      </nav>
      <div className="h-fit rounded-md border border-zinc-200 bg-white">
        <table className="h-full w-full">
          <thead className="w-full">
            <tr className="w-full">
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                #
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Course ID
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Description
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Instructor
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Day
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Time
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Academic Year
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item, index) => (
              <tr key={item._id} className="">
                <td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">
                  {index + 1}
                </td>
                <td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">
                  {item.course.courseId}
                </td>
                <td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">
                  {item.course.courseName}
                </td>
                <td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">
                  {item.teacher?.name || "N/A"}
                </td>
                <td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">
                  {item.day}
                </td>
                <td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">
                  {formatTime(item.startTime)} - {formatTime(item.endTime)}
                </td>
                <td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">
                  {item.academicYear}
                </td>
                <td className="flex gap-1.5 border-t border-zinc-200 px-4 py-3 text-left text-sm">
                  <button
                    onClick={() => openViewModal(item._id)}
                    className="grid cursor-pointer place-items-center rounded-md border border-zinc-300 p-1.5"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => openEditModal(item._id)}
                    className="grid cursor-pointer place-items-center rounded-md border border-zinc-300 p-1.5"
                  >
                    <SquarePen size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <GradeViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        scheduleId={selectedScheduleId}
        title="View Grades"
      ></GradeViewModal>

      <GradeEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        scheduleId={selectedScheduleId}
        title="Edit Grades"
      ></GradeEditModal>
    </div>
  );
};

export default GradeTable;
