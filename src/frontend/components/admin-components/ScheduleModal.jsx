import { useState, useEffect, useMemo } from 'react';
import useFormatTime from '../../custom-hooks/useFormatTime.js';
import axios from 'axios';

const ScheduleModal = ({ isOpen, onClose, student }) => {
	if (!isOpen || !student) return null;
	const { formatTime } = useFormatTime();

	const [courses, setCourses] = useState([]); // List of courses
	const [selectedCourse, setSelectedCourse] = useState(''); // Selected course ID
	const [schedules, setSchedules] = useState([]); // Available schedules for selected course
	const [selectedSchedules, setSelectedSchedules] = useState([]); // Selected schedules to assign
	const [loadingSchedules, setLoadingSchedules] = useState(false); // Loading state for schedules
	const [studentSchedules, setStudentSchedules] = useState([]);

	// Fetch courses when modal opens
	useEffect(() => {
		const fetchStudentData = async () => {
			if (!student) return;

			try {
				// Fetch courses and student schedule simultaneously
				const [coursesRes, schedRes] = await Promise.all([
					axios.get(
						`http://localhost:5000/api/courses/filter?yearLevel=${student.yearLevel}&areaOfStudy=${student.areaOfStudy}`
					),
					axios.get(
						`http://localhost:5000/api/student/schedule/${student._id}`
					),
				]);

				setStudentSchedules(schedRes.data.length ? schedRes.data : []);
				setCourses(coursesRes.data.courses || []); // Store all courses initially
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchStudentData();
	}, [student]); // Runs when `student` changes

	// Use useMemo to prevent unnecessary recalculations
	const filteredCourses = useMemo(() => {
		if (!studentSchedules.length || !courses.length) return courses;

		const excludedIds = studentSchedules.map((schedule) => schedule.course._id);
		return courses.filter((course) => !excludedIds.includes(course._id));
	}, [studentSchedules, courses]);

	useEffect(() => {
		if (filteredCourses.length !== courses.length) {
			console.log(
				'Excluded IDs:',
				studentSchedules.map((schedule) => schedule.course._id)
			);
			console.log('Filtered Courses:', filteredCourses);
			setCourses(filteredCourses);
		}
	}, [filteredCourses]); // Update state only when filteredCourses changes

	// useEffect(() => {
	// 	const fetchStudentSched = async () => {
	// 		if(!student) return;

	// 		try{

	// 			const response = await axios.get(`http://localhost:5000/api/student/schedule/${student._id}`)
	// 			setStudentSchedules(response.data)

	// 		}catch(err){
	// 				console.error('Error fetching student sched:', error);
	// 		}
	// 	}

	// 	fetchStudentSched();
	// }, [])

	// Handle course selection and fetch schedules
	const handleCourseChange = async (event) => {
		const course_Id = event.target.value;
		setSelectedCourse(course_Id);
		setSchedules([]); // Clear previous schedules
		setLoadingSchedules(true);

		try {
			const response = await axios.get(
				`http://localhost:5000/api/schedules/by-course?courseId=${course_Id}`
			);

			console.log(studentSchedules);

			setSchedules(response.data);
		} catch (error) {
			console.error('Error fetching schedules:', error);
		} finally {
			setLoadingSchedules(false);
		}
	};

	// Toggle schedule selection
	const handleSelectSchedule = (scheduleId) => {
		setSelectedSchedules(
			(prev) =>
				prev.includes(scheduleId)
					? prev.filter((id) => id !== scheduleId) // Remove if already selected
					: [...prev, scheduleId] // Add if not selected
		);
	};

	// Assign schedules to student
	const handleAssignSchedules = async () => {
		if (selectedSchedules.length === 0) return;

		try {
			console.log('Selected Schedules:', selectedSchedules);

			const response = await axios.post(
				`http://localhost:5000/api/students/${student._id}/assign-schedules`,
				{ scheduleIds: selectedSchedules.map((id) => id.toString()) }
			);

			alert(response.data.message); // ✅ Show success message
			onClose(); // Close modal after assigning schedules
		} catch (error) {
			console.error('Error assigning schedules:', error);
			alert(error.response?.data?.message || 'Failed to assign schedules.');
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/75 z-50">
			<div className="bg-white p-6 rounded-md max-w-[1000px] w-full shadow-lg h-full max-h-[800px] flex flex-col justify-between">
				<div className="flex flex-col gap-4 h-full">
					<h2 className="text-xl font-bold mb-4">
					{student.name} Schedule
					</h2>
					<div className="flex flex-col gap-2">
						<label className="block text-sm font-medium text-gray-700">
							Select Course
							<select
								onChange={handleCourseChange}
								value={selectedCourse || ''}
								className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md mt-1">
								<option value="" disabled>
									Select a course
								</option>
								{courses.map((course) => (
									<option key={course._id} value={course._id}>
										{course.courseId} - {course.courseName}
									</option>
								))}
							</select>
						</label>

						<div className="max-h-96 w-full h-full overflow-y-auto border border-zinc-300 rounded-md p-3">
							{loadingSchedules ? (
								<p className="text-gray-500 text-sm">Loading schedules...</p>
							) : schedules.length > 0 ? (
								<ul className="space-y-2">
									{schedules.map((schedule) => (
										<li
											key={schedule._id}
											className="border-b pb-2 flex items-center gap-3">
											<input
												type="checkbox"
												disabled={student.currentSubjects.includes(
													schedule._id
												)} // Disable if already assigned
												checked={selectedSchedules.includes(schedule._id)}
												onChange={() => handleSelectSchedule(schedule._id)}
												className="disabled:opacity-50"
											/>
											<div>
												<p className="font-semibold">
													{schedule.course?.courseId || 'N/A'}{' '}
													{schedule.course?.courseName || 'N/A'}
												</p>
												<p className="text-sm text-gray-600">
												{schedule.day.join("-")} {formatTime(schedule.startTime)} -{' '}
													{formatTime(schedule.endTime)}
												</p>
											</div>
										</li>
									))}
								</ul>
							) : (
								<p className="text-gray-500 text-sm text-center">
									No schedules available for this course.
								</p>
							)}
						</div>
					</div>



					<div className="border border-zinc-200 rounded-md h-full max-h-fit mt-4">
						<table className="w-full h-full text-left">
							<thead>
								<tr>
									<th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
										Course ID
									</th>
									<th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
										Course
									</th>
									<th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
										Day
									</th>
									<th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
										Room
									</th>
									<th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
										Time
									</th>
								</tr>
							</thead>
							<tbody>
								{studentSchedules.length > 0 ? (
									studentSchedules.map((sched, index) => (
										<tr key={index}>
											<td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">
												{sched.course.courseId}
											</td>
											<td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">
												{sched.course.courseName}
											</td>
											<td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">
												{sched.day}
											</td>
											<td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">
												{sched.room}
											</td>
											<td className="border-t border-zinc-200 px-4 py-3 text-left text-sm">
												{sched.startTime}-{sched.endTime}
											</td>
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan="5"
											className="border-t border-zinc-200 px-4 py-3 text-center text-sm text-gray-500">
											No schedules found.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex justify-end mt-4 gap-2">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-300 rounded-md text-sm">
						Cancel
					</button>
					<button
						onClick={handleAssignSchedules}
						disabled={selectedSchedules.length === 0 || schedules.length === 0}
						className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm disabled:opacity-50">
						Assign Schedules
					</button>
				</div>
			</div>
		</div>
	);
};

export default ScheduleModal;
