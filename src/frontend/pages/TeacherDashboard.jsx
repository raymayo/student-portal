import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TeacherDashboard = () => {
  const { teacherId } = useParams();

  const [schedules, setSchedules] = useState([]);


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
    <div>TeacherDashboard</div>
  )
}

export default TeacherDashboard