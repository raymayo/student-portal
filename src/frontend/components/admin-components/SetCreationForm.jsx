import React from "react";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
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

  console.log(selectedSchedules);

  return (
    <div className="grid h-full w-full grid-cols-2 gap-6">
      <form className="flex flex-col gap-4">
        <label className="flex w-full flex-col gap-1">
          <h1 className="text-sm font-medium">Department</h1>
          <select
            name="department"
            value={set.department}
            onChange={handleChange}
            className="block w-full rounded-md border border-slate-200 px-3 py-2 shadow-2xs"
          >
            <option value="">Department</option>
            <option value="Computer Science">Hackers</option>
            <option value="Business Education">Executives</option>
            <option value="Hospitality Management">Hoteliers</option>
            <option value="Teacher Education">Headmasters</option>
          </select>
        </label>
        <label className="flex w-full flex-col gap-1">
          <h1 className="text-sm font-medium">Course</h1>
          <select
            name="areaOfStudy"
            value={set.areaOfStudy}
            onChange={handleChange}
            className="block w-full rounded-md border border-slate-200 px-3 py-2 shadow-2xs"
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
            value={set.yearLevel}
            onChange={handleChange}
            className="block w-full rounded-md border border-slate-200 px-3 py-2 shadow-2xs"
          >
            <option value="">Select Year Level</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </label>
        <label className="flex w-full flex-col gap-1">
          <h1 className="text-sm font-medium">Set Name</h1>
          <select
            name="setName"
            value={set.setName}
            onChange={handleChange}
            className="block w-full rounded-md border border-slate-200 px-3 py-2 shadow-2xs"
          >
            <option value="">Select Set Name</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </label>
        <label className="flex w-full flex-col gap-1">
          <h1 className="text-sm font-medium">Semester</h1>
          <select
            name="semester"
            value={set.semester}
            onChange={handleChange}
            className="block w-full rounded-md border border-slate-200 px-3 py-2 shadow-2xs"
          >
            <option value="">Select Semester</option>
            <option value="1st Semester">1st Semester</option>
            <option value="2nd Semester">2nd Semester</option>
            <option value="Summer">Summer</option>
            <option value="Januarian">Januarian</option>
            <option value="Octoberian">Octoberian</option>
          </select>
        </label>
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

        <div className="mt-6">
          <h1 className="text-xl font-medium">Add Schedule to Set</h1>
          <label className="flex w-full flex-col gap-1">
            <h1 className="text-sm font-medium">Pick Course</h1>
            <select
              name=""
              className="block w-full rounded-md border border-slate-200 px-3 py-2 shadow-2xs"
              onChange={handleCourseChange}
              value={selectedCourse}
            >
              <option value="" disabled>
                Select a course
              </option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.courseId} - {course.courseName}
                </option>
              ))}
            </select>
          </label>
          <div>
            <ul>
              {schedules.map((schedule) => (
                <li
                  key={schedule._id}
                  onClick={() => handleSelectSchedule(schedule)}
                  className="flex items-center gap-2 rounded-md border p-2"
                >
                  {selectedSchedules.some((s) => s._id === schedule._id) ? (
                    <span className="bg-primary shadowm-xs grid h-5 w-5 cursor-pointer place-items-center rounded-sm text-black">
                      <Check size={15} />
                    </span>
                  ) : (
                    <span className="shadowm-xs grid h-5 w-5 cursor-pointer place-items-center rounded-sm border border-zinc-300">
                      {" "}
                    </span>
                  )}
                  {schedule.course.courseId} - {schedule.day} {schedule.time}
                </li>
              ))}
            </ul>
          </div>
          <button>add schedule</button>
        </div>
      </form>

      <div>
        <h1 className="text-xl font-medium">List of Schedule</h1>
        <div className="w-full">
          <table className="w-full">
            <thead>
              <tr>
                <th>Course</th>
                <th>Day</th>
                <th>Time</th>
                <th>Room</th>
              </tr>
            </thead>
            <tbody>
              {selectedSchedules.map((schedule) => (
                <tr key={schedule._id}>
                  <td>{schedule.course.courseId}</td>
                  <td>{schedule.day}</td>
                  <td>
                    {schedule.startTime} - {schedule.endTime}
                  </td>
                  <td>{schedule.room}</td>
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
