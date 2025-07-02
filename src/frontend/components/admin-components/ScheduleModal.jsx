/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import useFormatTime from "../../custom-hooks/useFormatTime.js";

const ScheduleModal = ({ isOpen, onClose, student }) => {
  if (!isOpen || !student) return null;
  const { formatTime } = useFormatTime();

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentSchedules, setStudentSchedules] = useState([]);

  /** Fetch courses and student's current schedules */
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [coursesRes, schedRes] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/courses/filter?yearLevel=${student.yearLevel}&areaOfStudy=${student.areaOfStudy}`,
          ),
          axios.get(
            `http://localhost:5000/api/student/schedule/${student._id}`,
          ),
        ]);

        setCourses(coursesRes.data?.courses || []);
        setStudentSchedules(schedRes.data || []);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };

    fetchInitialData();
  }, [student]);

  /** Filter out already assigned courses */
  const availableCourses = useMemo(() => {
    const assignedCourseIds = studentSchedules.map((s) => s.course._id);
    return courses.filter((c) => !assignedCourseIds.includes(c._id));
  }, [courses, studentSchedules]);

  /** Fetch schedules by selected course */
  const handleCourseChange = async (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    setSchedules([]);
    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/schedules/by-course?courseId=${courseId}`,
      );
      setSchedules(res.data);
    } catch (err) {
      console.error("Error loading schedules:", err);
    } finally {
      setLoading(false);
    }
  };

  const displayedSchedules = useMemo(() => {
    const selectedFullSchedules = schedules.filter((s) =>
      selectedSchedules.includes(s._id),
    );

    const combined = [...studentSchedules, ...selectedFullSchedules];

    // Remove duplicates by `_id`
    const uniqueSchedules = Array.from(
      new Map(combined.map((s) => [s._id, s])).values(),
    );

    return uniqueSchedules;
  }, [studentSchedules, selectedSchedules, schedules]);

  /** Toggle selection */
  const toggleSchedule = (scheduleId) => {
    setSelectedSchedules((prev) =>
      prev.includes(scheduleId)
        ? prev.filter((id) => id !== scheduleId)
        : [...prev, scheduleId],
    );
  };

  /** Assign selected schedules and create grade entries */
  const handleAssignSchedules = async () => {
    if (!selectedSchedules.length) return;

    try {
      const assignRes = await axios.post(
        `http://localhost:5000/api/schedules/${student._id}/assign-schedules`,
        { scheduleIds: selectedSchedules },
      );

      await Promise.all(
        selectedSchedules.map((id) =>
          axios.post(`http://localhost:5000/api/grades/${student._id}/${id}`),
        ),
      );

      alert(assignRes.data.message || "Schedules assigned.");
      onClose();
    } catch (err) {
      console.error("Assignment error:", err);
      alert(err.response?.data?.message || "Failed to assign schedules.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
      <div className="flex h-full max-h-[800px] w-full max-w-[1500px] flex-col justify-between rounded-md bg-white p-6 shadow-lg">
        <div className="grid h-full grid-cols-5 gap-4 overflow-hidden">
          {/* Left Panel */}
          <div className="col-span-2 flex flex-col gap-2 overflow-y-auto rounded-md border border-zinc-300 p-4">
            <div className="mb-2 border-b border-zinc-300 pb-2">
              <h2 className="text-sm">{student.name}'s</h2>
              <h2 className="text-xl font-semibold">Schedule Assignment</h2>
            </div>

            {/* Course Dropdown */}
            <label className="text-sm font-medium text-zinc-950">
              Select Course
              <select
                onChange={handleCourseChange}
                value={selectedCourse}
                className="mt-1 block w-full rounded-md border border-slate-200 px-3 py-2 shadow-2xs"
              >
                <option value="" disabled>
                  Select a course
                </option>
                {availableCourses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseId} - {course.courseName}
                  </option>
                ))}
              </select>
            </label>

            {/* Schedule Options */}
            <div className="mt-4 space-y-2">
              {loading ? (
                <p>Loading schedules...</p>
              ) : (
                schedules.map((sched) => {
                  const isSelected = selectedSchedules.includes(sched._id);
                  const isAlreadyAssigned = student.currentSubjects.includes(
                    sched._id,
                  );

                  return (
                    <li
                      key={sched._id}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 shadow-2xs transition-all duration-200 ease-out ${
                        isSelected
                          ? "outline-primary border-primary outline"
                          : "border-zinc-200"
                      }`}
                      onClick={() => {
                        if (!isAlreadyAssigned) toggleSchedule(sched._id);
                      }}
                    >
                      <input
                        type="checkbox"
                        disabled={isAlreadyAssigned}
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSchedule(sched._id);
                        }}
                        className="hidden"
                      />
                      <div>
                        <p className="font-semibold">
                          {sched.course?.courseId || "N/A"}{" "}
                          {sched.course?.courseName || "N/A"}
                        </p>
                        <p className="text-sm">
                          {sched.day.join("-")} {formatTime(sched.startTime)} -{" "}
                          {formatTime(sched.endTime)}
                        </p>
                        <p>{sched.teacher?.name || "NO TEACHER"}</p>
                      </div>
                    </li>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Panel - Student's Existing Schedule */}
          <div className="col-span-3">
            <div className="h-full w-full overflow-y-auto rounded-md border border-zinc-200">
              <table className="min-w-full text-left">
                <thead>
                  <tr>
                    {["Course ID", "Course", "Day", "Room", "Time"].map(
                      (label) => (
                        <th
                          key={label}
                          className="px-4 py-2.5 text-xs font-medium text-zinc-500"
                        >
                          {label}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {displayedSchedules.length ? (
                    displayedSchedules.map((sched, idx) => (
                      <tr key={sched._id || idx}>
                        <td className="border-y border-zinc-300 px-4 py-3 text-sm">
                          {sched.course?.courseId || "N/A"}
                        </td>
                        <td className="border-y border-zinc-300 px-4 py-3 text-sm">
                          {sched.course?.courseName || "N/A"}
                        </td>
                        <td className="border-y border-zinc-300 px-4 py-3 text-sm">
                          {sched.day?.join("-")}
                        </td>
                        <td className="border-y border-zinc-300 px-4 py-3 text-sm">
                          {sched.room || "N/A"}
                        </td>
                        <td className="border-y border-zinc-300 px-4 py-3 text-sm">
                          {formatTime(sched.startTime)} -{" "}
                          {formatTime(sched.endTime)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="border-t px-4 py-3 text-center text-sm text-gray-500"
                      >
                        No schedules found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md bg-gray-300 px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleAssignSchedules}
            disabled={!selectedSchedules.length}
            className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Assign Schedules
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
