import React, { useState, useEffect } from 'react';
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

	// Fetch courses when modal opens
	useEffect(() => {
		const fetchCourses = async () => {
			if (!student) return; // Ensure student data exists before making a request

			try {
				const response = await axios.get(
					`http://localhost:5000/api/courses/filter?yearLevel=${student.yearLevel}&areaOfStudy=${student.areaOfStudy}`
				);
				setCourses(response.data.courses || []); // Assuming the courses are in a `courses` key
			} catch (error) {
				console.error('Error fetching courses:', error);
			}
		};

		fetchCourses();
	}, [student]); // Re-fetch courses if the student changes

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
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="bg-white p-6 rounded-md w-[500px] shadow-lg">
				<h2 className="text-xl font-bold mb-4">
					Assign Schedules to {student.name}
				</h2>

				{/* Course Selection Dropdown */}
				<label className="block text-sm font-medium text-gray-700">
					Select Course
				</label>
				<select
					onChange={handleCourseChange}
					value={selectedCourse || ''}
					className="border p-2 rounded-md w-full">
					<option value="" disabled>
						Select a course
					</option>
					{courses.map((course) => (
						<option key={course._id} value={course._id}>
							{course.courseId} - {course.courseName}
						</option>
					))}
				</select>

				{/* Available Schedules */}
				<div className="max-h-60 overflow-y-auto border border-zinc-300 rounded-md p-3">
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
										disabled={student.currentSubjects.includes(schedule._id)} // Disable if already assigned
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
											{schedule.day}, {formatTime(schedule.startTime)} -{' '}
											{formatTime(schedule.endTime)}
										</p>
									</div>
								</li>
							))}
						</ul>
					) : (
						<p className="text-gray-500 text-sm">
							No schedules available for this course.
						</p>
					)}
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
