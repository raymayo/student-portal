import React from 'react'
import ScheduleForm from '../components/ScheduleForm.jsx'
import StudentRegistration from '../components/StudentRegistration.jsx';
import TeacherRegistration from '../components/TeacherRegistration.jsx';

const AdminPanel = () => {
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
      {/* <ScheduleForm onScheduleAdded={fetchSchedules}/> */}
      <TeacherRegistration/>
    </div>
  )
}

export default AdminPanel