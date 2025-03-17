import { useState, useEffect } from 'react';
import { createSchedule } from '../services/scheduleService';
import axios from 'axios';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const fullTimeSlots = [
	{ startTime: 1030, endTime: 1100 },
	{ startTime: 1100, endTime: 1130 },
	{ startTime: 1130, endTime: 1200 },
	{ startTime: 1200, endTime: 1230 },
	{ startTime: 1230, endTime: 1300 },
	{ startTime: 1300, endTime: 1330 },
];

const ScheduleForm = () => {
	const [schedule, setSchedule] = useState({
		course: '',
		day: '',
		room: '',
		startTime: '',
		endTime: '',
		teacher: null,
	});

	const [courses, setCourses] = useState([]);
	const [existingSchedules, setExistingSchedules] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch courses
				const courseResponse = await axios.get(
					'http://localhost:5000/api/courses'
				);
				setCourses(courseResponse.data);

				// Fetch existing schedules
				const scheduleResponse = await axios.get(
					'http://localhost:5000/api/schedules/raw'
				);
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
	const availableStartTimes = fullTimeSlots.filter((slot) => {
		return !existingSchedules.some(
			(existing) =>
				existing.day === schedule.day &&
				existing.room === schedule.room &&
				((slot.startTime >= existing.startTime &&
					slot.startTime < existing.endTime) ||
					(slot.endTime > existing.startTime &&
						slot.endTime <= existing.endTime))
		);
	});

	// **Filter available end times**
	const availableEndTimes = fullTimeSlots.filter(
		(slot) =>
			slot.startTime > schedule.startTime &&
			!existingSchedules.some(
				(existing) =>
					existing.day === schedule.day &&
					existing.room === schedule.room &&
					((slot.startTime >= existing.startTime &&
						slot.startTime < existing.endTime) ||
						(slot.endTime > existing.startTime &&
							slot.endTime <= existing.endTime))
			)
	);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			// Fetch updated schedules before checking conflicts
			const scheduleResponse = await axios.get(
				'http://localhost:5000/api/schedules/raw'
			);
			const existingSchedules = scheduleResponse.data;

			// Prevent submission if the selected slot is unavailable
			const isUnavailable = existingSchedules.some(
				(existing) =>
					existing.day === schedule.day &&
					existing.room === schedule.room &&
					((schedule.startTime >= existing.startTime &&
						schedule.startTime < existing.endTime) ||
						(schedule.endTime > existing.startTime &&
							schedule.endTime <= existing.endTime))
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
				endTime: '',
			});

			// Refresh schedule list
			const updatedScheduleResponse = await axios.get(
				'http://localhost:5000/api/schedules'
			);
			setExistingSchedules(updatedScheduleResponse.data);
		} catch (error) {
			console.error('Error creating schedule:', error);
		}
		console.log('Submitting schedule:', schedule);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="p-6 bg-white rounded-md  w-full max-w-[700px]">
                <div className='mb-6'>
                    <h1 className="text-xl font-semibold">Create Schedule</h1>
                    <p className='text-sm text-zinc-500'>Complete the Form to create a schedule</p>
                </div>

			<div className="flex flex-col gap-4">
            <label className="w-full flex flex-col gap-1">
            <h1 className="text-sm font-medium">Course</h1>
				{/* Course Dropdown */}
				<select
					name="course"
					value={schedule.course}
					onChange={handleChange}
					required
					className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md">
					<option value="">Select Course</option>
					{courses.map((course) => (
						<option key={course._id} value={course._id}>
							{course.courseId} - {course.courseName}
						</option>
					))}
				</select>
                    </label>
				{/* Day Dropdown */}
                <label className="w-full flex flex-col gap-1">
                <h1 className="text-sm font-medium">Day</h1>
				<select
					name="day"
					value={schedule.day}
					onChange={handleChange}
					required
					className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md">
					<option value="">Select Day</option>
					{daysOfWeek.map((day) => (
						<option key={day} value={day}>
							{day}
						</option>
					))}
				</select>
                </label>

				{/* Room Input */}
                <label className="w-full flex flex-col gap-1">
                <h1 className="text-sm font-medium">Room</h1>
                
				<input
					type="text"
					name="room"
					placeholder="Room"
					value={schedule.room}
					onChange={handleChange}
					required
					className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
				/>
                </label>

				<div className="flex flex-row gap-4">
					{/* Start Time Dropdown (Filtered) */}
					<label className="w-full flex flex-col gap-1">
						<h1 className="text-sm font-medium">Start Time</h1>
						<select
							name="startTime"
							value={schedule.startTime}
							onChange={handleStartTimeChange}
							required
							className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
							disabled={!schedule.day || !schedule.room}>
							<option value="">Select Start Time</option>
							{availableStartTimes.map((slot) => (
								<option key={slot.startTime} value={slot.startTime}>
									{slot.startTime}
								</option>
							))}
						</select>
					</label>

					<label className="w-full flex flex-col gap-1">
						<h1 className="text-sm font-medium">End Time</h1>

						{/* End Time Dropdown (Filtered) */}
						<select
							name="endTime"
							value={schedule.endTime}
							onChange={handleEndTimeChange}
							required
							className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
							disabled={!schedule.startTime}>
							<option value="">Select End Time</option>
							{availableEndTimes.map((slot) => (
								<option key={slot.endTime} value={slot.endTime}>
									{slot.endTime}
								</option>
							))}
						</select>
					</label>
				</div>
			</div>

			<button type="submit" className="bg-zinc-950 text-white px-3 py-2 rounded-md w-full mt-8 text-sm font-medium cursor-pointer">
				Add Schedule
			</button>
		</form>
	);
};

export default ScheduleForm;
