import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TeacherDashboard = () => {
  const { teacherId } = useParams();
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [grades, setGrades] = useState({ prelim: "", midterm: "", finals: "" });

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
    const grade = student.grades.find((g) => g.schedule === selectedSchedule._id);
    if (!grade) return alert("No grade record found for this student in this course.");
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
  
    const grade = selectedStudent.grades.find((g) => g.schedule === selectedSchedule._id);
    if (!grade) return alert("Grade not found for this course.");
  
    const updatedGrades = Object.fromEntries(
      Object.entries(grades).map(([key, val]) => [key, val !== "" ? val : null])
    );
  
    try {
      await axios.put(`http://localhost:5000/api/grades/${grade._id}`, updatedGrades);
  
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
                            : g
                        ),
                      }
                    : student
                ),
              }
            : schedule
        );
  
        // ✅ Find and update the selected schedule explicitly
        const updatedSelectedSchedule = updatedSchedules.find(s => s._id === selectedSchedule._id);
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
      <select onChange={handleSelectChange} defaultValue="" className="p-2 border rounded">
        <option value="" disabled>Select a schedule</option>
        {schedules.map(({ _id, course, day, startTime, endTime }) => (
          <option key={_id} value={_id}>
            {course.courseId} {course.courseName} - {day.join(", ")} {startTime} - {endTime}
          </option>
        ))}
      </select>

      {selectedSchedule && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">
            {selectedSchedule.course.courseId} {selectedSchedule.course.courseName}
          </h3>
          <p>{selectedSchedule.day.join(", ")} | {selectedSchedule.startTime} - {selectedSchedule.endTime}</p>

          <table className="mt-4 w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Student Name</th>
                <th className="border p-2">Prelim</th>
                <th className="border p-2">Midterm</th>
                <th className="border p-2">Finals</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedSchedule.students.map((student) => (
                <tr key={student._id} className="border">
                  <td className="border p-2">{student.name}</td>
                  <td className="border p-2">{student.grades[0]?.termGrades?.prelim ?? "N/A"}</td>
                  <td className="border p-2">{student.grades[0]?.termGrades?.midterm ?? "N/A"}</td>
                  <td className="border p-2">{student.grades[0]?.termGrades?.finals ?? "N/A"}</td>
                  <td className="border p-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => openModal(student)}
                    >
                      Edit Grade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Grades for {selectedStudent.name}</h3>
            {["prelim", "midterm", "finals"].map((term) => (
              <label key={term} className="block mb-2">
                {term.charAt(0).toUpperCase() + term.slice(1)}:
                <input type="number" name={term} value={grades[term]} onChange={handleGradeChange} className="ml-2 border p-1" />
              </label>
            ))}
            <div className="flex justify-end gap-2 mt-4">
              <button className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500" onClick={closeModal}>Cancel</button>
              <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600" onClick={handleSaveGrades}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
