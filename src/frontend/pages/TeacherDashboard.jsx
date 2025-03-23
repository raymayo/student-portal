import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TeacherDashboard = () => {
  const { teacherId } = useParams();

  const [schedules, setSchedules] = useState([]);

  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const handleScheduleChange = (event) => {
    const selectedId = event.target.value;
    const schedule = schedules.find((s) => s._id === selectedId);
    setSelectedSchedule(schedule);
  };


  useEffect(() => {
    axios
    .get(`http://localhost:5000/api/schedules/?teacher=${teacherId}`)
    .then((res) => {
      if (Array.isArray(res.data)) {
        setSchedules(res.data);
      } else {
        console.error('Expected an array, but received:', res.data);
        setSchedules([]);
      }
    })
  },[])

  console.log(schedules);

  return (
    <div>
      <select name="" id="" onChange={handleScheduleChange}>
        <option value="">Select a schedule</option>
        {schedules.map((schedule, index) => {
          return (
            <option key={index} value={schedule._id}>
               {schedule.course.courseId} {schedule.course.courseName} - {schedule.day} {schedule.startTime} - {schedule.endTime}
            </option>
          )
        })}
      </select>


      {selectedSchedule && (
  <table border="1" style={{ marginTop: "20px", width: "100%", textAlign: "left" }}>
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Year Level</th>
        <th>Prelim</th>
        <th>Midterm</th>
        <th>Finals</th>
        <th>Equivalent</th>
        <th>Remarks</th>
      </tr>
    </thead>
    <tbody>
      {selectedSchedule.students && selectedSchedule.students.length > 0 ? (
        selectedSchedule.students.map((student, index) => (
          <tr key={student.id || index}>
            <td>{index + 1}</td>
            <td>{student.name}</td>
            <td>{student.yearLevel}</td>
            <td>{student.grades?.prelim || "N/A"}</td>
            <td>{student.grades?.midterm || "N/A"}</td>
            <td>{student.grades?.finals || "N/A"}</td>
            <td>{student.grades?.finals || "N/A"}</td>
            <td>{student.grades?.finals || "N/A"}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="6" style={{ textAlign: "center" }}>No students enrolled</td>
        </tr>
      )}
    </tbody>
  </table>
)}
    </div>
  )
}

export default TeacherDashboard