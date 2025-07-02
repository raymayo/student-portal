import React from "react";
import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import axios from "axios";
import Tooltip from "../Tooltip.jsx";
import useFormatDay from "../../custom-hooks/useFormatDay.js";
import useFormatTime from "../../custom-hooks/useFormatTime.js";
import ConfirmationModal from "../ConfirmationModal.jsx";

const SetCreationForm = () => {
  const allYear = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"];
  const [academicYear, setAcademicYear] = useState("");
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedSchedules, setSelectedSchedules] = useState([]);

  const { formatDay } = useFormatDay();
  const { formatTime } = useFormatTime();

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
      const isAlreadySelected = prev.some((s) => s._id === schedule._id);

      // Update selectedSchedules state
      const updatedSelectedSchedules = isAlreadySelected
        ? prev.filter((s) => s._id !== schedule._id) // Remove if already selected
        : [...prev, schedule]; // Add if not selected

      // Update set.schedules with only schedule IDs
      setSet((prevSet) => {
        const isScheduleInSet = prevSet.schedules.includes(schedule._id);

        return {
          ...prevSet,
          schedules: isScheduleInSet
            ? prevSet.schedules.filter((id) => id !== schedule._id) // Remove ID if already in set
            : [...prevSet.schedules, schedule._id], // Add only the ID if not in set
        };
      });

      return updatedSelectedSchedules; // Return new selected schedules state
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

  useEffect(() => {
    setSet((prev) => ({ ...prev, academicYear }));
  }, [academicYear]);

  const handleRemoveSchedule = (schedule) => {
    setSelectedSchedules((prev) => prev.filter((s) => s._id !== schedule._id));
  };
  console.log(selectedSchedules);

  const handleCreateSet = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/sets", set);
      console.log(response.data);
    } catch (error) {
      console.error(
        "Error creating set:",
        error.response?.data?.message || error.message,
      );
    } finally {
      setLoading(false);
      setSelectedSchedules([]);
      setSelectedCourse("");
      setSchedules([]);
      setYearStart("");
      setYearEnd("");
      setSet((prev) => ({
        ...prev,
        department: "",
        areaOfStudy: "",
        yearLevel: "",
        setName: "",
        academicYear: "",
        semester: "",
        schedules: [],
      }));
    }
  };

  const setDetails = [
    { label: "Set", value: set?.setName },
    { label: "Course", value: set?.areaOfStudy },
    { label: "Year Level", value: set?.yearLevel },
    { label: "Semester", value: set?.semester },
    { label: "Academic Year", value: set?.academicYear },
  ];

  const DetailItem = ({ label, value }) => (
    <div className="w-fit rounded-md border border-zinc-200 px-2.5 py-1.5 text-sm text-zinc-700 shadow-2xs">
      {label}: <span className="font-medium text-black">{value || "N/A"}</span>
    </div>
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirm = () => {
    console.log("Confirmed action!");
    handleCreateSet();
    setIsModalOpen(false);
  };
  const handleOpenModal = () => {
    if (selectedSchedules.length === 0) {
      alert("Please select at least one schedule.");
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="grid h-full w-full grid-cols-3 gap-4">
      <form className="col-span-1 flex flex-col items-stretch justify-start gap-4 rounded-md border border-zinc-200 bg-white py-4 shadow-xs">
        <div className="flex flex-col gap-2.5 px-6">
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
        <div className="flex h-full flex-col px-6">
          <h1 className="text-lg font-medium">Add Schedule to Set</h1>
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
          <ul className="mt-4 flex flex-1 flex-col gap-2 overflow-y-auto">
            {schedules.map((schedule) => (
              <li
                key={schedule._id}
                onClick={() => handleSelectSchedule(schedule)}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-zinc-200 p-2 transition-all duration-200 hover:bg-zinc-100"
              >
                {selectedSchedules.some((s) => s._id === schedule._id) ? (
                  <span className="bg-primary shadowm-xs grid h-5 w-5 place-items-center rounded-sm text-black">
                    <Check size={15} />
                  </span>
                ) : (
                  <span className="shadowm-xs grid h-5 w-5 place-items-center rounded-sm border border-zinc-300"></span>
                )}
                <div className="flex flex-col justify-between">
                  <div className="">
                    <h1 className="text-xs font-bold">
                      {schedule.course.courseId} {schedule.course.courseName}
                    </h1>
                    <span className="text-sm">
                      {formatDay(schedule.day)} {formatTime(schedule.startTime)}{" "}
                      - {formatTime(schedule.endTime)}
                    </span>
                    {/* <p className="max-w-24 truncate text-sm"></p> */}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm">
                      {schedule.teacher?.name
                        ? ` ${schedule.teacher.name}`
                        : ""}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <button
            className="mt-6 w-full cursor-pointer self-end rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
            onClick={(e) => {
              e.preventDefault();
              setIsModalOpen(true);
            }}
          >
            Create Set
          </button>
        </div>
      </form>

      <div className="col-span-2 flex h-full flex-col rounded-md border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="mb-2 flex gap-2">
          {setDetails.map(({ label, value }) => (
            <DetailItem key={label} label={label} value={value} />
          ))}
        </div>

        {/* Wrapper that limits height and enables scrolling */}
        <div className="flex-1 overflow-y-auto rounded-md border border-zinc-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200">
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
                <th className="px-4 py-2.5 text-center text-xs font-medium text-zinc-500">
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
                    {formatDay(schedule.day)}
                  </td>
                  <td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
                    {formatTime(schedule.startTime)} -{" "}
                    {formatTime(schedule.endTime)}
                  </td>
                  <td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
                    {schedule.room}
                  </td>
                  <td className="max-w-fit border-y border-zinc-200 px-4 py-3 text-left text-sm">
                    <Tooltip text="Remove Schedule" position="top">
                      <button
                        className="cursor-pointer rounded-md border border-zinc-300 p-1.5 shadow-2xs transition-all duration-200 hover:bg-zinc-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSchedule(schedule);
                        }}
                      >
                        <X size={16} />
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title="Are you sure?"
        message="This action cannot be undone. This will permanently create the set and add the data from our servers."
        confirmText="Continue"
        cancelText="Cancel"
      />
    </div>
  );
};

export default SetCreationForm;
