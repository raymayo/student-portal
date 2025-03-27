import { useState, useEffect } from "react";
import { createSchedule } from "../../services/scheduleService";
import axios from "axios";
import useFormatTime from "../../custom-hooks/useFormatTime.js";

//TODO filter area of study based on department

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const allYear = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"];

const fullTimeSlots = [
  { startTime: 800, endTime: 830 },
  { startTime: 830, endTime: 900 },
  { startTime: 900, endTime: 930 },
  { startTime: 930, endTime: 1000 },
  { startTime: 1000, endTime: 1030 },
  { startTime: 1030, endTime: 1100 },
  { startTime: 1100, endTime: 1130 },
  { startTime: 1130, endTime: 1200 },
  { startTime: 1200, endTime: 1230 },
  { startTime: 1230, endTime: 1300 },
  { startTime: 1300, endTime: 1330 },
  { startTime: 1330, endTime: 1400 },
  { startTime: 1400, endTime: 1430 },
  { startTime: 1430, endTime: 1500 },
  { startTime: 1500, endTime: 1530 },
  { startTime: 1530, endTime: 1600 },
  { startTime: 1600, endTime: 1630 },
  { startTime: 1630, endTime: 1700 },
  { startTime: 1700, endTime: 1730 },
  { startTime: 1730, endTime: 1800 },
  { startTime: 1800, endTime: 1830 },
  { startTime: 1830, endTime: 1900 },
  { startTime: 1900, endTime: 1930 },
  { startTime: 1930, endTime: 2000 },
  { startTime: 2000, endTime: 2030 },
  { startTime: 2030, endTime: 2100 },
  { startTime: 2100, endTime: 2130 },
];

const ScheduleForm = () => {
  const { formatTime } = useFormatTime();

  const [academicYear, setAcademicYear] = useState("");
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");
  const [courses, setCourses] = useState([]);
  const [existingSchedules, setExistingSchedules] = useState([]);

  const [schedule, setSchedule] = useState({
    course: "",
    day: [],
    room: "",
    startTime: "",
    endTime: "",
    department: "",
    areaOfStudy: "",
    yearLevel: "",
    semester: "",
    academicYear: "",
    teacher: null,
  });

  useEffect(() => {
    console.log("Updated Schedule:", schedule);
  }, [schedule]);

  useEffect(() => {
    if (!schedule.yearLevel || !schedule.department || !schedule.areaOfStudy)
      return;

    const getExistingSchedules = async () => {
      try {
        const scheduleResponse = await axios.get(
          `http://localhost:5000/api/schedules/filter?yearLevel=${schedule.yearLevel}&department=${schedule.department}&areaOfStudy=${schedule.areaOfStudy}`,
        );
        setExistingSchedules(scheduleResponse.data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    getExistingSchedules();
  }, [schedule.yearLevel, schedule.department, schedule.areaOfStudy]);

  const getAvailableTimeSlots = (
    fullTimeSlots,
    existingSchedules,
    targetRoom,
    targetDays,
  ) => {
    return fullTimeSlots.filter((slot) => {
      return !existingSchedules.some((existing) => {
        const isSameRoom = existing.room === targetRoom; // ✅ Only check conflicts in the same room
        const isSameDay = existing.day.some((d) => targetDays.includes(d)); // ✅ Only check conflicts on the requested days

        const isOverlapping =
          slot.startTime < existing.endTime &&
          slot.endTime > existing.startTime; // ✅ Proper time conflict check

        return isSameRoom && isSameDay && isOverlapping;
      });
    });
  };

  const availableSlots = getAvailableTimeSlots(
    fullTimeSlots,
    existingSchedules,
    schedule.room,
    schedule.day,
  );
  console.log("AVAILABLESSSS", availableSlots);

  const onScheduleAdded = async () => {
    try {
      // Fetch the updated schedules after adding a new one
      const updatedScheduleResponse = await axios.get(
        "http://localhost:5000/api/schedules",
      );
      setExistingSchedules(updatedScheduleResponse.data);

      // Optionally, show a success message
      alert("Schedule added successfully!");
    } catch (error) {
      console.error("Error refreshing schedule list:", error);
    }
  };

  useEffect(() => {
    if (!schedule.yearLevel || !schedule.department || !schedule.areaOfStudy)
      return;
    const fetchData = async () => {
      try {
        const courseResponse = await axios.get(
          `http://localhost:5000/api/courses/filter?yearLevel=${schedule.yearLevel}&areaOfStudy=${schedule.areaOfStudy}&department=${schedule.department}`,
        );
        console.log("API Response:", courseResponse.data);
        setCourses(
          Array.isArray(courseResponse.data.courses)
            ? courseResponse.data.courses
            : [],
        );
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]); // Reset courses to avoid displaying stale data
      }
    };
    fetchData();
  }, [schedule.yearLevel, schedule.department, schedule.areaOfStudy]);

  console.log(courses);

  const handleChange = (e) => {
    setSchedule((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleStartTimeChange = (e) => {
    const selectedStartTime = parseInt(e.target.value, 10);
    setSchedule((prev) => ({
      ...prev,
      startTime: selectedStartTime,
      endTime: null, // Reset properly
    }));
  };

  const handleEndTimeChange = (e) => {
    setSchedule({ ...schedule, endTime: parseInt(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Fetch updated schedules before checking conflicts
      const scheduleResponse = await axios.get(
        "http://localhost:5000/api/schedules/raw",
      );
      const existingSchedules = scheduleResponse.data;

      // Prevent submission if the selected slot is unavailable
      const isUnavailable = existingSchedules.some(
        (existing) =>
          existing.day.includes(schedule.day) && // ✅ Fix: Check if schedule.day is inside existing.day array
          existing.room === schedule.room &&
          ((schedule.startTime >= existing.startTime &&
            schedule.startTime < existing.endTime) ||
            (schedule.endTime > existing.startTime &&
              schedule.endTime <= existing.endTime)),
      );

      if (isUnavailable) {
        alert("This time slot is unavailable. Please select another time.");
        return;
      }

      // Proceed with adding the schedule
      await createSchedule(schedule);
      if (onScheduleAdded) onScheduleAdded();

      // Reset form
      setSchedule((prev) => ({
        ...prev,
        day: [...[]], // Ensures state change is detected
        course: "",
        room: "",
        department: "",
        yearLevel: "",
        startTime: "",
        endTime: "",
        areaOfStudy: "",
        semester: "",
        academicYear: "",
      }));

      // Refresh schedule list
      const updatedScheduleResponse = await axios.get(
        "http://localhost:5000/api/schedules",
      );
      setExistingSchedules(updatedScheduleResponse.data);
    } catch (error) {
      console.error("Error creating schedule:", error);
    }
    console.log("Submitting schedule:", schedule);
  };

  const handleYearChange = (e) => {
    const { name, value } = e.target;

    if (name === "yearStart") {
      setYearStart(value);
      setYearEnd(""); // Reset yearEnd when yearStart changes
    } else if (name === "yearEnd") {
      setYearEnd(value);
      setAcademicYear(`${yearStart}-${value}`);
    }
  };

  // Sync academicYear with schedule state
  useEffect(() => {
    setSchedule((prev) => ({ ...prev, academicYear }));
  }, [academicYear]);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[700px] rounded-md bg-white p-6"
    >
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Create Schedule</h1>
        <p className="text-sm text-zinc-500">
          Complete the Form to create a schedule
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex w-full flex-col gap-1">
          <h1 className="text-sm font-medium">Department</h1>
          <select
            name="department"
            value={schedule.department}
            onChange={handleChange}
            className="block w-full cursor-pointer rounded-md border border-slate-200 px-3 py-2 shadow-2xs"
            required
          >
            <option value="">Department</option>
            <option value="Computer Science">Hackers</option>
            <option value="Business Education">Executives</option>
            <option value="Hospitality Management">Hoteliers</option>
            <option value="Teacher Education">Headmasters</option>
          </select>
        </label>

        <div className="flex gap-2">
          <label className="flex w-full flex-col gap-1">
            <h1 className="text-sm font-medium">Area Of Study</h1>

            <select
              name="areaOfStudy"
              value={schedule.areaOfStudy}
              onChange={handleChange}
              className="block w-full cursor-pointer rounded-md border border-slate-200 px-3 py-2 shadow-2xs disabled:bg-zinc-200"
              required
              disabled={!schedule.department}
            >
              <option value="" disabled>
                Select Course
              </option>
              <option value="BSBA HRM">BSBA HRM</option>
              <option value="BSBA FM">BSBA FM</option>
              <option value="BSA">BSA</option>
              <option value="BSCS">BSCS</option>
              <option value="BSED MATH & FIL">BSED MATH & FIL</option>
              <option value="BSED SOCSTUD">BSED SOCSTUD</option>
              <option value="BEED">BEED</option>
              <option value="CPE">CPE</option>
              <option value="BSHM">BSHM</option>
            </select>
          </label>

          <label className="flex w-full flex-col gap-1">
            <h1 className="text-sm font-medium">Year Level</h1>
            <select
              name="yearLevel"
              value={schedule.yearLevel}
              onChange={handleChange}
              className="block w-full cursor-pointer rounded-md border border-slate-200 px-3 py-2 shadow-2xs disabled:bg-zinc-200"
              disabled={!schedule.areaOfStudy}
              required
            >
              <option value="">Select Year Level</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </label>
        </div>
        <label className="flex w-full flex-col gap-1">
          <h1 className="text-sm font-medium">Course</h1>
          {/* Course Dropdown */}
          <select
            name="course"
            value={schedule.course}
            onChange={handleChange}
            required
            className="block w-full rounded-md border border-slate-200 px-3 py-2 shadow-2xs"
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.courseId} - {course.courseName}
              </option>
            ))}
          </select>
        </label>
        <select
          name="semester"
          value={schedule.semester}
          onChange={handleChange}
          className="block w-full cursor-pointer rounded-md border border-slate-200 px-3 py-2 shadow-2xs disabled:bg-zinc-200"
          required
        >
          <option value="">Select Semester</option>
          <option value="1st Semester">1st Semester</option>
          <option value="2nd Semester">2nd Semester</option>
          <option value="Summer">Summer</option>
          <option value="Januarian">Januarian</option>
          <option value="Octoberian">Octoberian</option>
        </select>
        <div>
          <h1 className="mb-1 text-sm font-medium">Academic Year</h1>
          <label className="flex w-full gap-2">
            <select
              name="yearStart"
              value={yearStart}
              onChange={handleYearChange}
              required
              className="block w-full rounded-md border border-slate-200 px-3 py-2 shadow-2xs"
            >
              <option value="" disabled>
                Select Year Start
              </option>
              {allYear.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              name="yearEnd"
              value={yearEnd}
              onChange={handleYearChange}
              required
              className="block w-full rounded-md border border-slate-200 px-3 py-2 shadow-2xs"
              disabled={!yearStart}
            >
              <option value="" disabled>
                Select Year End
              </option>
              {allYear
                .filter((year) => year > yearStart)
                .map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
            </select>
          </label>
        </div>

        {/* Day Dropdown */}
        <label className="flex w-full flex-col gap-1">
          <h1 className="text-sm font-medium">Day</h1>
          <div className="flex gap-2">
            {daysOfWeek.map((day) => (
              <label
                key={day}
                className="flex w-full cursor-pointer items-center gap-2 rounded-md border border-zinc-300 p-2"
              >
                <input
                  type="checkbox"
                  value={day}
                  checked={schedule.day.includes(day)}
                  onChange={(e) => {
                    const selectedDay = e.target.value;
                    setSchedule((prev) => ({
                      ...prev,
                      day: prev.day.includes(selectedDay)
                        ? prev.day.filter((d) => d !== selectedDay) // Remove if already selected
                        : [...prev.day, selectedDay], // Add if not selected
                    }));
                  }}
                  className="h-4 w-4"
                />
                {day}
              </label>
            ))}
          </div>
        </label>

        {/* Room Input */}
        <label className="flex w-full flex-col gap-1">
          <h1 className="text-sm font-medium">Room</h1>

          <input
            type="text"
            name="room"
            placeholder="Room"
            value={schedule.room}
            onChange={handleChange}
            required
            className="block w-full rounded-md border border-slate-200 px-3 py-2 shadow-2xs"
          />
        </label>

        <div className="flex flex-row gap-4">
          {/* Start Time Dropdown (Filtered) */}
          <label className="flex w-full flex-col gap-1">
            <h1 className="text-sm font-medium">Start Time</h1>
            <select
              name="startTime"
              value={schedule.startTime}
              onChange={handleStartTimeChange}
              required
              className="block w-full rounded-md border border-slate-200 px-3 py-2 shadow-2xs"
              disabled={schedule.day.length === 0 || !schedule.room}
            >
              <option value="">Select Start Time</option>
              {availableSlots.map((slot) => (
                <option key={slot.startTime} value={slot.startTime}>
                  {formatTime(slot.startTime)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex w-full flex-col gap-1">
            <h1 className="text-sm font-medium">End Time</h1>

            {/* End Time Dropdown (Filtered) */}
            <select
              name="endTime"
              value={schedule.endTime}
              onChange={handleEndTimeChange}
              required
              className="block w-full rounded-md border border-slate-200 px-3 py-2 shadow-2xs"
              disabled={!schedule.startTime}
            >
              <option value="">Select End Time</option>
              {availableSlots.map((slot) => (
                <option key={slot.endTime} value={slot.endTime}>
                  {formatTime(slot.endTime)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="mt-8 w-full cursor-pointer rounded-md bg-zinc-950 px-3 py-2 text-sm font-medium text-white"
      >
        Add Schedule
      </button>
    </form>
  );
};

export default ScheduleForm;
