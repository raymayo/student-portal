import React from 'react'
import ScheduleForm from '../components/ScheduleForm.jsx'

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
    <div>
      <ScheduleForm onScheduleAdded={fetchSchedules}/>
    </div>
  )
}

export default AdminPanel