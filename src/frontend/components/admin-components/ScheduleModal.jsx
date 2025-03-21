import { useState, useEffect, useMemo } from 'react';
import useFormatTime from '../../custom-hooks/useFormatTime.js';
import axios from 'axios';
import { createGrade } from '../../services/gradeService.js';

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
			console.log("Selected Schedules:", selectedSchedules);
	
			// Assign schedules to student
			const response = await axios.post(
				`http://localhost:5000/api/schedules/${student._id}/assign-schedules`,
				{ scheduleIds: selectedSchedules.map((id) => id.toString()) }
			);
	
			// Create grade documents for each assigned schedule
			for (const scheduleId of selectedSchedules) {
				await createGrade(student._id, scheduleId);
			}
	
			alert(response.data.message); // ✅ Show success message
			onClose(); // Close modal after assigning schedules
		} catch (error) {
			console.error("Error assigning schedules:", error);
			alert(error.response?.data?.message || "Failed to assign schedules.");
		}
	};
	
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/75 z-50">
			<div className="bg-white p-6 rounded-md max-w-[1500px] w-full shadow-lg h-full max-h-[800px] flex flex-col justify-between">
				<div className="grid grid-cols-5 gap-4 h-full">
					<div className="flex flex-col gap-2 w-full h-full overflow-y-auto border border-zinc-300 rounded-md p-4 col-span-2">
						<div className="border-b border-zinc-200 pb-2 mb-2">
							<h2 className="text-sm">{student.name}'s</h2>
							<h2 className="font-semibold text-xl">Schedule Assignment</h2>
						</div>
						<label className="block text-sm font-medium text-zinc-950">
							Select Course
							<select
								onChange={handleCourseChange}
								value={selectedCourse || ''}
								className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md mt-1 cursor-pointer">
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

						<div className="mt-4">
							<ul className="space-y-2">
								{schedules.map((schedule) => {
									const isSelected = selectedSchedules.includes(schedule._id);
									return (
										<li
											key={schedule._id}
											className={`border flex items-center gap-3 p-4 cursor-pointer rounded-lg transition-all duration-200 ease-out shadow-2xs ${
												isSelected
													? 'outline outline-primary border-primary'
													: 'border-zinc-200'
											}`}
											onClick={() => {
												if (!student.currentSubjects.includes(schedule._id)) {
													handleSelectSchedule(schedule._id);
												}
											}}>
											<input
												type="checkbox"
												disabled={student.currentSubjects.includes(
													schedule._id
												)}
												checked={isSelected}
												onChange={(e) => {
													e.stopPropagation(); // Prevents the li click event from firing when clicking the checkbox
													handleSelectSchedule(schedule._id);
												}}
												className="hidden" // Hides the checkbox
											/>
											<div>
												<p className="font-semibold">
													{schedule.course?.courseId || 'N/A'}{' '}
													{schedule.course?.courseName || 'N/A'}
												</p>
												<p className="text-sm">
													{schedule.day.join('-')}{' '}
													{formatTime(schedule.startTime)} -{' '}
													{formatTime(schedule.endTime)}
												</p>
												<p>
													{schedule.teacher?.name || 'NO TEACHER'}
												</p>
											</div>
										</li>
									);
								})}
							</ul>
						</div>
					</div>

					<div className="col-span-3">
						{/* <h2 className="text-sm">{student.name}'s</h2>
					<h2 className="font-bold text-xl">Schedule Table</h2> */}
						<div className="border border-zinc-200 rounded-md h-full w-full ">
							<table className="w-full h-fit text-left">
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
												<td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
													{sched.course.courseId}
												</td>
												<td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
													{sched.course.courseName}
												</td>
												<td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
													{sched.day}
												</td>
												<td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
													{sched.room}
												</td>
												<td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
													{formatTime(sched.startTime)}-
													{formatTime(sched.endTime)}
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
				</div>

				{/* Action Buttons */}
				<div className="flex justify-end mt-4 gap-2">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-300 rounded-md text-sm cursor-pointer">
						Cancel
					</button>
					<button
						onClick={handleAssignSchedules}
						disabled={selectedSchedules.length === 0 || schedules.length === 0}
						className="bg-zinc-950 text-zinc-100 px-3 py-2 rounded-md w-fit text-sm font-medium cursor-pointer">
						Assign Schedules
					</button>
				</div>
			</div>
		</div>
	);
};

export default ScheduleModal;
