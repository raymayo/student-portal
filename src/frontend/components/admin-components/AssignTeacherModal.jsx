import { useState, useEffect, useMemo } from "react";
import useFormatTime from "../../custom-hooks/useFormatTime.js";
import axios from "axios";

const departmentToAreaMap = {
  "Business Education": ["BSBA HRM", "BSBA FM", "BSA"],
  "Computer Science": ["BSCS"],
  "Teacher Education": ["BSED MATH & FIL", "BSED SOCSTUD", "BEED", "CPE"],
  "Hospitality Management": ["BSHM"],
};

const AssignTeacherModal = ({ isOpen, onClose, teacher }) => {
  if (!isOpen || !teacher) return null;

  const [schedules, setSchedules] = useState([]);

  const [filters, setFilters] = useState({
    yearLevel: "3",
    department: teacher.department,
    areaOfStudy: "BSCS",
  });

  const filteredCourses = filters.department
    ? departmentToAreaMap[filters.department] || []
    : [];

  const [selectedSchedules, setSelectedSchedules] = useState([]); // Selected schedules to assign

  const { formatTime } = useFormatTime();

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!filters.yearLevel || !filters.department || !filters.areaOfStudy)
      return;

    axios
      .get(
        `http://localhost:5000/api/schedules/filter?yearLevel=${filters.yearLevel}&department=${filters.department}&areaOfStudy=${filters.areaOfStudy}`,
      )
      .then((res) => {
        if (Array.isArray(res.data)) {
          setSchedules(res.data);
        } else {
          console.error("Expected an array, but received:", res.data);
          setSchedules([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setSchedules([]);
      });
  }, [filters.yearLevel, filters.department, filters.areaOfStudy]);

  console.log(filters);

  const handleSelectSchedule = (scheduleId) => {
    setSelectedSchedules(
      (prev) =>
        prev.includes(scheduleId)
          ? prev.filter((id) => id !== scheduleId) // Remove if already selected
          : [...prev, scheduleId], // Add if not selected
    );
  };

  const handleAssignSchedules = async () => {
    if (selectedSchedules.length === 0) return;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/schedules/${teacher._id}/assign-teacher`, // Pass teacherId in URL
        { scheduleIds: selectedSchedules }, // Send scheduleIds in request body
      );

      console.log("Assignment Success:", response.data);
      setSelectedSchedules([]); // Clear selection after assignment
      onClose(); // Close modal
    } catch (error) {
      console.error("Error assigning schedules:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
      <div className="flex h-full max-h-[800px] w-full max-w-[1500px] flex-col justify-between rounded-md bg-white p-6 shadow-lg">
        <form className="flex flex-col gap-4">
          <label className="flex w-full flex-col gap-1">
            <h1 className="text-sm font-medium">Department</h1>
            <input
              className="block w-full cursor-pointer rounded-md border border-slate-200 px-3 py-2 shadow-2xs disabled:bg-zinc-200"
              type="text"
              value={teacher.department}
              disabled
            />
          </label>
          <label className="flex w-full flex-col gap-1">
            <h1 className="text-sm font-medium">Area Of Study</h1>

            <select
              name="areaOfStudy"
              value={filters.areaOfStudy}
              onChange={handleChange}
              className="block w-full cursor-pointer rounded-md border border-slate-200 px-3 py-2 shadow-2xs disabled:bg-zinc-200"
              required
              disabled={!filters.department}
            >
              <option value="" disabled>
                Select Course
              </option>
              {filteredCourses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </label>
          <label className="flex w-full flex-col gap-1">
            <h1 className="text-sm font-medium">Year Level</h1>
            <select
              name="yearLevel"
              value={filters.yearLevel}
              onChange={handleChange}
              className="block w-full cursor-pointer rounded-md border border-slate-200 px-3 py-2 shadow-2xs disabled:bg-zinc-200"
              // disabled={!areaOfStudy}
              required
            >
              <option value="">Select Year Level</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </label>
        </form>

        <div>
          {" "}
          <ul className="space-y-2">
            {schedules.map((schedule) => {
              const isSelected = selectedSchedules.includes(schedule._id);
              return (
                <li
                  key={schedule._id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 shadow-2xs transition-all duration-200 ease-out ${
                    isSelected
                      ? "outline-primary border-primary outline"
                      : "border-zinc-200"
                  }`}
                  onClick={() => {
                    if (!teacher.teachingSchedules.includes(schedule._id)) {
                      handleSelectSchedule(schedule._id);
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    disabled={teacher.teachingSchedules.includes(schedule._id)}
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation(); // Prevents the li click event from firing when clicking the checkbox
                      handleSelectSchedule(schedule._id);
                    }}
                    className="hidden" // Hides the checkbox
                  />
                  <div>
                    <p className="font-semibold">
                      {schedule.course?.courseId || "N/A"}{" "}
                      {schedule.course?.courseName || "N/A"}
                    </p>
                    <p className="text-sm">
                      {schedule.day.join("-")} {formatTime(schedule.startTime)}{" "}
                      - {formatTime(schedule.endTime)}
                    </p>
                    <p>{schedule.teacher?.name || "NO TEACHER"}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-md bg-gray-300 px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleAssignSchedules}
            disabled={selectedSchedules.length === 0}
            className="w-fit cursor-pointer rounded-md bg-zinc-950 px-3 py-2 text-sm font-medium text-zinc-100"
          >
            Assign Schedules
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignTeacherModal;
