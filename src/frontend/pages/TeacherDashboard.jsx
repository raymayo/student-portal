import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { SquarePen } from "lucide-react";
import Tooltip from "../components/Tooltip.jsx";

const TeacherDashboard = () => {
  const { teacherId } = useParams();
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [grades, setGrades] = useState({ prelim: "", midterm: "", finals: "" });

  const calculateFinalGrade = (prelim, midterm, finals) => {
    return prelim * 0.3 + midterm * 0.3 + finals * 0.4;
  };

  function GPA(percentage) {
    if (percentage >= 96) return 1.0;
    if (percentage >= 93) return 1.25;
    if (percentage >= 90) return 1.5;
    if (percentage >= 87) return 1.75;
    if (percentage >= 84) return 2.0;
    if (percentage >= 81) return 2.25;
    if (percentage >= 78) return 2.5;
    if (percentage >= 75) return 2.75;
    if (percentage >= 70) return 3.0;
    return 5.0; // Failing grade
  }

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/schedules/?teacher=${teacherId}`)
      .then(({ data }) => setSchedules(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching schedules:", err));
  }, [teacherId]);

  const handleSelectChange = ({ target: { value } }) => {
    setSelectedSchedule(schedules.find(({ _id }) => _id === value) || null);
  };

  const openModal = (student) => {
    if (!selectedSchedule) return;
    const grade = student.grades.find(
      (g) => g.schedule === selectedSchedule._id,
    );
    if (!grade)
      return alert("No grade record found for this student in this course.");
    setSelectedStudent(student);
    setGrades({
      prelim: grade.termGrades?.prelim ?? "",
      midterm: grade.termGrades?.midterm ?? "",
      finals: grade.termGrades?.finals ?? "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedStudent(null);
  };

  const handleGradeChange = ({ target: { name, value } }) => {
    setGrades((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveGrades = async () => {
    if (!selectedStudent || !selectedSchedule) return;

    const grade = selectedStudent.grades.find(
      (g) => g.schedule === selectedSchedule._id,
    );
    if (!grade) return alert("Grade not found for this course.");

    const updatedGrades = Object.fromEntries(
      Object.entries(grades).map(([key, val]) => [
        key,
        val !== "" ? val : null,
      ]),
    );

    try {
      await axios.put(
        `http://localhost:5000/api/grades/${grade._id}`,
        updatedGrades,
      );

      setSchedules((prevSchedules) => {
        const updatedSchedules = prevSchedules.map((schedule) =>
          schedule._id === selectedSchedule._id
            ? {
                ...schedule,
                students: schedule.students.map((student) =>
                  student._id === selectedStudent._id
                    ? {
                        ...student,
                        grades: student.grades.map((g) =>
                          g.schedule === selectedSchedule._id
                            ? { ...g, termGrades: { ...updatedGrades } } // Force deep update
                            : g,
                        ),
                      }
                    : student,
                ),
              }
            : schedule,
        );

        // ✅ Find and update the selected schedule explicitly
        const updatedSelectedSchedule = updatedSchedules.find(
          (s) => s._id === selectedSchedule._id,
        );
        setSelectedSchedule(updatedSelectedSchedule || null);

        return updatedSchedules;
      });

      alert("Grade updated successfully!");
      closeModal();
    } catch (error) {
      console.error("Error updating grade:", error);
      alert("Failed to update grade.");
    }
  };

  return (
    <div className="p-6">
      <select
        onChange={handleSelectChange}
        defaultValue=""
        className="rounded border p-2"
      >
        <option value="" disabled>
          Select a schedule
        </option>
        {schedules.map(({ _id, course, day, startTime, endTime }) => (
          <option key={_id} value={_id}>
            {course.courseId} {course.courseName} - {day.join(", ")} {startTime}{" "}
            - {endTime}
          </option>
        ))}
      </select>

      {selectedSchedule && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">
            {selectedSchedule.course.courseId}{" "}
            {selectedSchedule.course.courseName}
          </h3>
          <p>
            {selectedSchedule.day.join(", ")} | {selectedSchedule.startTime} -{" "}
            {selectedSchedule.endTime}
          </p>

          <table className="mt-4 w-full border-collapse border border-gray-300">
            <thead>
              <tr className="">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                  Student Name
                </th>
                <th className="text-zinc-5002 px-4 py-2.5 text-left text-xs font-medium">
                  Prelim
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                  Midterm
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                  Finals
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                  Equivalent
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                  Remarks
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedSchedule.students.map((student) => (
                <tr key={student._id} className="">
                  <td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
                    {student.name}
                  </td>
                  <td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
                    {student.grades[0]?.termGrades?.prelim ?? "N/A"}
                  </td>
                  <td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
                    {student.grades[0]?.termGrades?.midterm ?? "N/A"}
                  </td>
                  <td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
                    {student.grades[0]?.termGrades?.finals ?? "N/A"}
                  </td>
                  <td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
                    {GPA(
                      calculateFinalGrade(
                        student.grades[0].termGrades.prelim,
                        student.grades[0].termGrades.midterm,
                        student.grades[0].termGrades.finals,
                      ),
                    ) || "N/A"}
                  </td>
                  <td
                    className={`border-y border-zinc-200 px-4 py-3 text-left text-sm ${
                      GPA(
                        calculateFinalGrade(
                          student.grades[0].termGrades.prelim,
                          student.grades[0].termGrades.midterm,
                          student.grades[0].termGrades.finals,
                        ),
                      ) <= 3.0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {GPA(
                      calculateFinalGrade(
                        student.grades[0].termGrades.prelim,
                        student.grades[0].termGrades.midterm,
                        student.grades[0].termGrades.finals,
                      ),
                    ) <= 3.0
                      ? "PASSED"
                      : "FAILED"}
                  </td>
                  <td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
                    <Tooltip text="Update Grade" position="top">
                      <button
                        className="cursor-pointer rounded-md border border-zinc-300 p-2 shadow-2xs transition-all duration-200 hover:bg-zinc-100"
                        onClick={() => openModal(student)}
                      >
                        <SquarePen size={16} />
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/75">
          <div className="w-96 rounded bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">
              Edit Grades for {selectedStudent.name} in{" "}
              {selectedSchedule.course.courseName}
            </h3>
            <div className="flex flex-col gap-2">
              {["prelim", "midterm", "finals"].map((term) => (
                <label key={term} className="flex flex-col">
                  {term.charAt(0).toUpperCase() + term.slice(1)}
                  <input
                    type="number"
                    name={term}
                    value={grades[term]}
                    onChange={handleGradeChange}
                    className="rounded-md border border-zinc-300 px-2 py-1.5 shadow-2xs"
                  />
                </label>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="cursor-pointer rounded border border-zinc-300 bg-white px-3 py-1 text-black shadow-2xs hover:bg-zinc-200"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="cursor-pointer rounded bg-zinc-900 px-3 py-1 text-white hover:bg-zinc-900/98"
                onClick={handleSaveGrades}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
