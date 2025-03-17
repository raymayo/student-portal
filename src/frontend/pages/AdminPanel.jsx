import React, { useState, useEffect } from "react";
import ScheduleForm from '../components/ScheduleForm.jsx'
import StudentRegistration from '../components/StudentRegistration.jsx';
import TeacherRegistration from '../components/TeacherRegistration.jsx';
import AssignTeacherForm from '../components/AssignTeacherForm.jsx';
import AddCourseForm from "../components/AddCourseForm.jsx";
import Modal from "../components/Modal.jsx";
import axios from 'axios';

const AdminPanel = () => {

  const [schedules, setSchedules] = useState([]);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/schedules/raw");
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  return (
    <div className='grid place-items-center w-full h-full'>
      <h1>Admin Dashboard</h1>
      {/* <ScheduleForm onScheduleAdded={fetchSchedules}/> */}
      {/* <TeacherRegistration/> */}
      {/* <AssignTeacherForm/> */}
      {/* <AddCourseForm/> */}
      <AddCourseForm/>
    </div>
  )
}

export default AdminPanel