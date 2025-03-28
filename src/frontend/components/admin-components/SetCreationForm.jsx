import React from "react";
import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import axios from "axios";

const SetCreationForm = () => {
  const allYear = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"];
  const [academicYear, setAcademicYear] = useState("");
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [schedules, setSchedules] = useState([]);

  const [selectedSchedules, setSelectedSchedules] = useState([]);

  const [set, setSet] = useState({
    department: "",
    areaOfStudy: "",
    yearLevel: "",
    setName: "",
    academicYear: "",
    semester: "",
    schedules: [],
  });

  console.log(set);

  const handleCourseChange = async (e) => {
    const newCourseId = e.target.value;
    setSelectedCourse(newCourseId);
    setSchedules([]);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/schedules/by-course?courseId=${newCourseId}`,
      );

      console.log(response.data);
      setSchedules(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectSchedule = (schedule) => {
    setSelectedSchedules((prev) => {
      if (prev.some((s) => s._id === schedule._id)) {
        return prev.filter((s) => s._id !== schedule._id); // Deselect if already selected
      } else {
        return [...prev, schedule]; // Add to selection
      }
    });
  };

  const { yearLevel, areaOfStudy } = set || {};

  useEffect(() => {
    if (!yearLevel || !areaOfStudy) return;

    const fetchScheduleByCourse = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/courses/filter?yearLevel=${yearLevel}&areaOfStudy=${areaOfStudy}`,
        );

        setCourses(data.courses);
        // console.log(courses);
      } catch (error) {
        console.log(error);
      }
    };

    fetchScheduleByCourse();
  }, [yearLevel, areaOfStudy]);

  const handleChange = (e) => {
    setSet({
      ...set,
      [e.target.name]: e.target.value,
    });
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

  const handleRemoveSchedule = (schedule) => {
    setSelectedSchedules((prev) => prev.filter((s) => s._id !== schedule._id));
  };
  console.log(selectedSchedules);

  return (
    <div className="grid h-full w-full grid-cols-3 gap-4">
      <form className="col-span-1 flex flex-col items-stretch justify-start gap-4 rounded-md border border-zinc-200 bg-white">
        <div className="flex flex-col gap-2.5 p-4">
          <label className="flex w-full flex-col gap-1">
            <h1 className="text-xs font-medium">Department</h1>
            <select
              name="department"
              value={set.department}
              onChange={handleChange}
              className="block w-full cursor-pointer rounded-md border border-slate-200 px-3 py-2 shadow-2xs"
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
              <h1 className="text-xs font-medium">Course</h1>
              <select
                name="areaOfStudy"
                value={set.areaOfStudy}
                onChange={handleChange}
                className="block w-full cursor-pointer rounded-md border border-slate-200 px-3 py-2 shadow-2xs"
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
              <h1 className="text-xs font-medium">Year Level</h1>
              <select
                name="yearLevel"
                value={set.yearLevel}
                onChange={handleChange}
                className="block w-full cursor-pointer rounded-md border border-slate-200 px-3 py-2 shadow-2xs"
              >
                <option value="">Select Year Level</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </label>
          </div>
          <div className="flex gap-2">
            <label className="flex w-full flex-col gap-1">
              <h1 className="text-xs font-medium">Set Name</h1>
              <select
                name="setName"
                value={set.setName}
                onChange={handleChange}
                className="block w-full cursor-pointer rounded-md border border-slate-200 px-3 py-2 shadow-2xs"
              >
                <option value="">Select Set Name</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </label>
            <label className="flex w-full flex-col gap-1">
              <h1 className="text-xs font-medium">Semester</h1>
              <select
                name="semester"
                value={set.semester}
                onChange={handleChange}
                className="block w-full cursor-pointer rounded-md border border-slate-200 px-3 py-2 shadow-2xs"
              >
                <option value="">Select Semester</option>
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
                <option value="Summer">Summer</option>
                <option value="Januarian">Januarian</option>
                <option value="Octoberian">Octoberian</option>
              </select>
            </label>
          </div>
          <div>
            <h1 className="mb-1 text-xs font-medium">Academic Year</h1>
            <label className="flex w-full gap-2">
              <select
                name="yearStart"
                value={yearStart}
                onChange={handleYearChange}
                required
                className="block w-full cursor-pointer rounded-md border border-slate-200 px-3 py-2 shadow-2xs"
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
                className="block w-full cursor-pointer rounded-md border border-slate-200 px-3 py-2 shadow-2xs"
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
        </div>
        <div className="flex h-full flex-col p-4">
          <h1 className="text-xl font-medium">Add Schedule to Set</h1>
          <label className="flex w-full flex-col gap-1">
            <select
              className="block w-full cursor-pointer rounded-md border border-slate-200 px-3 py-2 shadow-2xs"
              onChange={handleCourseChange}
              value={selectedCourse}
            >
              <option value="" disabled>
                Pick a Course Schedule
              </option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.courseId} - {course.courseName}
                </option>
              ))}
            </select>
          </label>

          {/* Ensuring the <ul> takes up remaining space and scrolls properly */}
          <ul className="flex-1 overflow-y-auto">
            {schedules.map((schedule) => (
              <li
                key={schedule._id}
                onClick={() => handleSelectSchedule(schedule)}
                className="flex cursor-pointer items-center gap-2 border-b border-zinc-200 p-2"
              >
                {selectedSchedules.some((s) => s._id === schedule._id) ? (
                  <span className="bg-primary shadowm-xs grid h-5 w-5 place-items-center rounded-sm text-black">
                    <Check size={15} />
                  </span>
                ) : (
                  <span className="shadowm-xs grid h-5 w-5 place-items-center rounded-sm border border-zinc-300"></span>
                )}
                {schedule.course.courseId} - {schedule.day} {schedule.time}
              </li>
            ))}
          </ul>
        </div>
      </form>

      <div className="col-span-2 flex h-full flex-col rounded-md border border-zinc-200 bg-white p-4">
        <h1 className="text-xl font-medium">List of Schedule</h1>

        {/* Wrapper that limits height and enables scrolling */}
        <div className="flex-1 overflow-y-auto rounded-md border border-zinc-200 bg-white">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                  #
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                  Course
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                  Day
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                  Time
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                  Room
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedSchedules.map((schedule, index) => (
                <tr key={schedule._id}>
                  <td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
                    {index + 1}
                  </td>
                  <td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
                    {schedule.course.courseId}
                  </td>
                  <td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
                    {schedule.day}
                  </td>
                  <td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
                    {schedule.startTime} - {schedule.endTime}
                  </td>
                  <td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
                    {schedule.room}
                  </td>
                  <td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
                    <button
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSchedule(schedule);
                      }}
                    >
                      <X />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SetCreationForm;
