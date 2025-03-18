import { useState, useEffect } from "react";
import axios from "axios";

const AssignTeacherForm = () => {
  const [schedules, setSchedules] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState({}); // Store teacher selections per schedule

  // Fetch raw schedules (no populate)
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/schedules/raw")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setSchedules(res.data);
        } else {
          console.error("Expected an array, but received:", res.data);
          setSchedules([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching schedules:", err);
        setSchedules([]);
      });
  }, []);

  // Fetch teachers (Users with role 'teacher')
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users?role=teacher")
      .then((res) => setTeachers(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error("Error fetching teachers:", err);
        setTeachers([]);
      });
  }, []);

  // Format military time to 12-hour format
  const formatTime = (time) => {
    const hours = Math.floor(time / 100);
    const minutes = time % 100;
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  // Handle teacher selection for each schedule
  const handleTeacherChange = (scheduleId, teacherId) => {
    setSelectedTeachers((prev) => ({
      ...prev,
      [scheduleId]: teacherId,
    }));
  };

  // Assign Teacher to Schedule
  const handleAssignTeacher = async (e, scheduleId) => {
    e.preventDefault(); // Prevents form submission behavior

    const selectedTeacherId = selectedTeachers[scheduleId]; // Get teacher ID for the given schedule

    if (!selectedTeacherId) {
        alert('Please select a teacher.');
        return;
    }

    console.log('Assigning teacher:', { scheduleId, teacherId: selectedTeacherId });

    try {
        const response = await axios.put(
            `http://localhost:5000/api/schedules/${scheduleId}/assign-teacher`,
            { teacherId: selectedTeacherId }, 
            { headers: { 'Content-Type': 'application/json' } }
        );

        alert('Teacher assigned successfully!');
        console.log(response.data);
    } catch (error) {
        console.error('Error assigning teacher:', error.response?.data || error.message);
        alert(`Failed to assign teacher: ${error.response?.data?.error || 'Unknown error'}`);
    }
};



  return (
    <div className="p-6 bg-white shadow-xs rounded-md w-full max-w-[1200px]">
      <h2 className="text-xl font-semibold mb-4">Assign Teacher to Schedule</h2>

<div className=" border border-zinc-200 rounded-md">
      <table className="w-full">
        <thead className="">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-zinc-500">Course</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-zinc-500">Day</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-zinc-500">Time</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-zinc-500">Room</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-zinc-500">Teacher</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-zinc-500">Action</th>
          </tr>
        </thead>
        <tbody>
          {schedules.length > 0 ? (
            schedules.map((schedule) => (
              <tr key={schedule._id} className="text-center">
                <td className="border-t border-zinc-200 px-4 py-2 text-left">
                  {schedule.course?.courseName || "Unknown Course"}
                </td>
                <td className="border-t border-zinc-200 px-4 py-2 text-left">
                  {schedule.day}
                </td>
                <td className="border-t border-zinc-200 px-4 py-2 text-left">
                  {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                </td>
                <td className="border-t border-zinc-200 px-4 py-2 text-left">{schedule.room}</td>
                <td className="border-t border-zinc-200 px-4 py-2 text-left">
                  <select
                    value={selectedTeachers[schedule._id] || schedule.teacher || ""}
                    onChange={(e) => handleTeacherChange(schedule._id, e.target.value)}
                    className="px-2 py-1 border border-zinc-200 rounded"
                  >
                    <option value="">Select a Teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.name} ({teacher.email})
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border-t border-zinc-200 px-4 py-2 text-left">
                  <button
             onClick={(e) => handleAssignTeacher(e, schedule._id)}
                    className="bg-zinc-900 text-white px-3 py-2 rounded-md text-sm cursor-pointer"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                No schedules available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default AssignTeacherForm;
