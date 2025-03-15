import { useState, useEffect } from 'react';
import { createSchedule } from '../services/scheduleService';
import axios from 'axios';

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const fullTimeSlots = [
  { startTime: 1030, endTime: 1100 },
  { startTime: 1100, endTime: 1130 },
  { startTime: 1130, endTime: 1200 },
  { startTime: 1200, endTime: 1230 },
  { startTime: 1230, endTime: 1300 },
  { startTime: 1300, endTime: 1330 },
];

const ScheduleForm = ({ onScheduleAdded }) => {
  const [schedule, setSchedule] = useState({
    course: '',
    day: '',
    room: '',
    startTime: '',
    endTime: ''
  });

  const [courses, setCourses] = useState([]);
  const [existingSchedules, setExistingSchedules] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses
        const courseResponse = await axios.get('http://localhost:5000/api/courses');
        setCourses(courseResponse.data);

        // Fetch existing schedules
        const scheduleResponse = await axios.get('http://localhost:5000/api/schedules/raw');
        setExistingSchedules(scheduleResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setSchedule({ ...schedule, [e.target.name]: e.target.value });
  };

  const handleStartTimeChange = (e) => {
    const selectedStartTime = parseInt(e.target.value);
    setSchedule({ ...schedule, startTime: selectedStartTime, endTime: '' });
  };

  const handleEndTimeChange = (e) => {
    setSchedule({ ...schedule, endTime: parseInt(e.target.value) });
  };

  // **Filter available start times**
  const availableStartTimes = fullTimeSlots.filter(slot => {
    return !existingSchedules.some(existing =>
      existing.day === schedule.day &&
      existing.room === schedule.room &&
      (
        (slot.startTime >= existing.startTime && slot.startTime < existing.endTime) || 
        (slot.endTime > existing.startTime && slot.endTime <= existing.endTime)
      )
    );
  });

  // **Filter available end times**
  const availableEndTimes = fullTimeSlots.filter(slot => 
    slot.startTime > schedule.startTime &&
    !existingSchedules.some(existing =>
      existing.day === schedule.day &&
      existing.room === schedule.room &&
      (
        (slot.startTime >= existing.startTime && slot.startTime < existing.endTime) || 
        (slot.endTime > existing.startTime && slot.endTime <= existing.endTime)
      )
    )
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Fetch updated schedules before checking conflicts
      const scheduleResponse = await axios.get('http://localhost:5000/api/schedules/raw');
      const existingSchedules = scheduleResponse.data;

      // Prevent submission if the selected slot is unavailable
      const isUnavailable = existingSchedules.some(existing =>
        existing.day === schedule.day &&
        existing.room === schedule.room &&
        (
          (schedule.startTime >= existing.startTime && schedule.startTime < existing.endTime) ||
          (schedule.endTime > existing.startTime && schedule.endTime <= existing.endTime)
        )
      );

      if (isUnavailable) {
        alert('This time slot is unavailable. Please select another time.');
        return;
      }

      // Proceed with adding the schedule
      await createSchedule(schedule);
      if (onScheduleAdded) onScheduleAdded();

      // Reset form
      setSchedule({
        course: '',
        day: '',
        room: '',
        startTime: '',
        endTime: ''
      });

      // Refresh schedule list
      const updatedScheduleResponse = await axios.get('http://localhost:5000/api/schedules');
      setExistingSchedules(updatedScheduleResponse.data);
      
    } catch (error) {
        console.error('Error creating schedule:', error);
    }
    console.log("Submitting schedule:", schedule);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded">
      {/* Course Dropdown */}
      <select name="course" value={schedule.course} onChange={handleChange} required className="block w-full p-2 border rounded mb-2">
        <option value="">Select Course</option>
        {courses.map(course => (
          <option key={course._id} value={course._id}>
            {course.courseId} - {course.courseName}
          </option>
        ))}
      </select>

      {/* Day Dropdown */}
      <select name="day" value={schedule.day} onChange={handleChange} required className="block w-full p-2 border rounded mb-2">
        <option value="">Select Day</option>
        {daysOfWeek.map(day => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>

      {/* Room Input */}
      <input type="text" name="room" placeholder="Room" value={schedule.room} onChange={handleChange} required className="block w-full p-2 border rounded mb-2" />

      {/* Start Time Dropdown (Filtered) */}
      <select name="startTime" value={schedule.startTime} onChange={handleStartTimeChange} required className="block w-full p-2 border rounded mb-2" disabled={!schedule.day || !schedule.room}>
        <option value="">Select Start Time</option>
        {availableStartTimes.map(slot => (
          <option key={slot.startTime} value={slot.startTime}>
            {slot.startTime}
          </option>
        ))}
      </select>

      {/* End Time Dropdown (Filtered) */}
      <select name="endTime" value={schedule.endTime} onChange={handleEndTimeChange} required className="block w-full p-2 border rounded mb-2" disabled={!schedule.startTime}>
        <option value="">Select End Time</option>
        {availableEndTimes.map(slot => (
          <option key={slot.endTime} value={slot.endTime}>
            {slot.endTime}
          </option>
        ))}
      </select>

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Schedule</button>
    </form>
  );
};

export default ScheduleForm;
