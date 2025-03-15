// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FilePen, Trash } from 'lucide-react';

// const SetGenerator = () => {
// 	const [yearLevel, setYearLevel] = useState('1stYear');
// 	const [semester, setSemester] = useState('1stSemester');
// 	const [definedCourse, setDefinedCourse] = useState([]);

// 	const [schedules, setSchedules] = useState([]);

// 	const [courseSchedule, setCourseSchedule] = useState({
// 		courseId: '',
// 		courseName: '',
// 		courseUnit: '',
// 		day: '',
// 		room: '',
// 		startTime: '',
// 		endTime: '',
// 	});

// 	const [allCourse, setAllCourse] = useState([]);

// 	const [setDetails, setSetDetails] = useState({
// 		name: 'Set A',
// 		yearLevel: '1st Year',
// 		semester: '1st Semester',
// 		department: 'BSCS',
// 		courseId: [],
// 	});

// 	//EDIT ACTIONS OF TABLE
// 	const [editSchedule, setEditSchedule] = useState(null); // Track the course being edited
// 	const [isModalOpen, setIsModalOpen] = useState(false);

// 	// Function to handle the Edit button click
// 	const handleEdit = (schedule) => {
// 		setEditSchedule({ ...schedule }); // Clone to avoid state mutation
// 		setIsModalOpen(true);
// 	};

// 	// Close modal
// 	const closeModal = () => {
// 		setIsModalOpen(false);
// 		setEditSchedule(null);
// 	};

// 	const updateSchedule = (updatedSchedule) => {
// 		setSchedules(
// 			schedules.map((schedule) =>
// 				schedule.courseId === updatedSchedule.courseId
// 					? {
// 							...schedule,
// 							...updatedSchedule, // Apply all changes in updatedSchedule
// 					  }
// 					: schedule
// 			)
// 		);

// 		setAllCourse(
// 			allCourse.map((course) =>
// 				course.courseId === updatedSchedule.courseId
// 					? { ...course, ...updatedSchedule } // Update only matching course
// 					: course
// 			)
// 		);

// 		closeModal();

// 		// console.log(updatedSchedule)
// 		console.log(schedules);
// 		// console.log(allCourse)
// 	};

// 	const handleDelete = (courseId) => {
// 		if (window.confirm('Are you sure you want to delete this schedule?')) {
// 			setAllCourse(
// 				allCourse.filter((schedule) => schedule.courseId !== courseId)
// 			);
// 			setSchedules(
// 				allCourse.filter((schedule) => schedule.courseId !== courseId)
// 			);
// 			console.log(`schedules:`, schedules);
// 			console.log(`allCourse: `, allCourse);

// 			setCourseSchedule({
// 				courseId: '',
// 				courseName: '',
// 				courseUnit: '',
// 				day: '',
// 				room: '',
// 				startTime: '',
// 				endTime: '',
// 			});
// 		}
// 	};

// 	function convertTo12Hour(time24) {
// 		// Convert time string to a 4-digit string (e.g., 800 -> "0800")
// 		time24 = time24.toString().padStart(4, '0');

// 		// Extract hours and minutes
// 		let hours = parseInt(time24.slice(0, 2));
// 		const minutes = time24.slice(2);

// 		// Determine AM or PM
// 		const period = hours >= 12 ? 'PM' : 'AM';

// 		// Adjust hours for 12-hour format
// 		hours = hours % 12 || 12;

// 		return `${hours}:${minutes} ${period}`;
// 	}

// 	const fullTimeSlots = [
// 		{ startTime: 800, endTime: 830 },
// 		{ startTime: 830, endTime: 900 },
// 		{ startTime: 900, endTime: 930 },
// 		{ startTime: 930, endTime: 1000 },
// 		{ startTime: 1000, endTime: 1030 },
// 		{ startTime: 1030, endTime: 1100 },
// 		{ startTime: 1100, endTime: 1130 },
// 		{ startTime: 1130, endTime: 1200 },
// 		{ startTime: 1200, endTime: 1230 },
// 		{ startTime: 1230, endTime: 1300 },
// 		{ startTime: 1300, endTime: 1330 },
// 		{ startTime: 1330, endTime: 1400 },
// 		{ startTime: 1400, endTime: 1430 },
// 		{ startTime: 1430, endTime: 1500 },
// 		{ startTime: 1500, endTime: 1530 },
// 		{ startTime: 1530, endTime: 1600 },
// 		{ startTime: 1600, endTime: 1630 },
// 		{ startTime: 1630, endTime: 1700 },
// 		{ startTime: 1700, endTime: 1730 },
// 		{ startTime: 1730, endTime: 1800 },
// 		{ startTime: 1800, endTime: 1830 },
// 		{ startTime: 1830, endTime: 1900 },
// 		{ startTime: 1900, endTime: 1930 },
// 		{ startTime: 1930, endTime: 2000 },
// 		{ startTime: 2000, endTime: 2030 },
// 		{ startTime: 2030, endTime: 2100 },
// 		{ startTime: 2100, endTime: 2130 },
// 	];

// 	const [existingSet, setExistingSet] = useState([]);

// 	const allSet = [
// 		'SET A',
// 		'SET B',
// 		'SET C',
// 		'SET D',
// 		'SET E',
// 		'SET F',
// 		'SET G',
// 		'SET H',
// 		'SET I',
// 		'SET J',
// 		'SET J',
// 		'SET K',
// 		'SET L',
// 		'SET M',
// 		'SET N',
// 		'SET O',
// 		'SET P',
// 		'SET Q',
// 		'SET R',
// 		'SET S',
// 		'SET T',
// 		'SET U',
// 		'SET V',
// 		'SET W',
// 		'SET X',
// 		'SET Y',
// 		'SET Z',
// 	];

// 	const fetchSets = async () => {
// 		try {
// 			const response = await fetch(`http://localhost:5000/api/sets`);
// 			if (!response.ok) {
// 				throw new Error('Failed to fetch sets');
// 			}
// 			const data = await response.json();
// 			const names = data.map((set) => set.name); // Only extracting names
// 			setExistingSet(names);
// 		} catch (error) {
// 			console.error(error);
// 		}
// 	};

// 	useEffect(() => {
// 		fetchSets(); // This will run once when the component is initially rendered.
// 		console.log('Updated sets:', existingSet);
// 	}, []); // Empty dependency array means it only runs on initial render.

// 	useEffect(() => {
// 		if (setDetails.yearLevel && setDetails.semester) {
// 			fetch(`../courses/BSCS/${setDetails.yearLevel}Course.json`)
// 				.then((response) => response.json())
// 				.then((data) =>
// 					setDefinedCourse(
// 						data[`${setDetails.yearLevel}`][`${setDetails.semester}`]
// 					)
// 				)
// 				.catch((error) => console.error('Error fetching course data:', error));
// 		}
// 	}, [setDetails.yearLevel, setDetails.semester]);

// 	const result = definedCourse.filter(
// 		(course) => course.name === courseSchedule.courseName
// 	)[0];

// 	useEffect(() => {
// 		if (result) {
// 			setCourseSchedule((prev) => ({
// 				...prev,
// 				courseId: result.courseId || '', // Set predefined courseId
// 				courseUnit: result.courseUnit || '', // Set predefined courseUnit
// 			}));
// 		}
// 	}, [result]);

// 	const handleCourseScheduleChange = (e) => {
// 		const { name, value } = e.target;
// 		setCourseSchedule((prev) => ({ ...prev, [name]: value }));
// 		// console.log(courseSchedule);
// 	};

// 	const handleSetDetailsChange = (e) => {
// 		const { name, value } = e.target;
// 		setSetDetails({ ...setDetails, [name]: value });
// 		// console.log(setDetails)
// 	};

// 	const addCourseSchedule = (e) => {
// 		e.preventDefault();
// 		setAllCourse([...allCourse, courseSchedule]);

// 		setSchedules((prevSchedules) => [
// 			...prevSchedules,
// 			{
// 				day: courseSchedule.day,
// 				room: courseSchedule.room,
// 				startTime: parseInt(courseSchedule.startTime, 10), // Ensure it's a number
// 				endTime: parseInt(courseSchedule.endTime, 10), // Ensure it's a number
// 				courseId: courseSchedule.courseId, // Include courseId
// 			},
// 		]);

// 		// Reset courseSchedule input fields
// 		setCourseSchedule({
// 			courseId: '',
// 			courseName: '',
// 			courseUnit: '',
// 			day: '',
// 			room: '',
// 			startTime: '',
// 			endTime: '',
// 		});
// 	};

// 	// Submit all data to backend
// 	const submitSetWithCourses = async (e) => {
// 		e.preventDefault();
// 		try {
// 			// First, create all course schedules in the backend
// 			const courseIds = await Promise.all(
// 				allCourse.map(async (schedule) => {
// 					const response = await axios.post(
// 						'http://localhost:5000/api/course-schedules',
// 						schedule
// 					);
// 					return response.data._id; // Get the ID of each created CourseSchedule
// 				})
// 			);

// 			// Then, create the set with the IDs of all course schedules
// 			const setData = {
// 				...setDetails,
// 				courses: courseIds, // Link all course IDs to this set
// 			};
// 			await axios.post('http://localhost:5000/api/sets', setData);

// 			alert('Set and Course Schedules added successfully!');
// 			setAllCourse([]); // Reset the list of course schedules
// 			setSetDetails({ name: '', yearLevel: '', department: '', semester: '' }); // Reset set details
// 			// console.log(setDetails);
// 		} catch (error) {
// 			console.error('Error submitting data:', error);
// 		}
// 	};

// 	const fetchSchedules = async () => {
// 		try {
// 			// Ensure `courseSchedule.day` and `courseSchedule.room` are defined
// 			if (
// 				!courseSchedule?.day ||
// 				!courseSchedule?.room ||
// 				!courseSchedule?.courseId
// 			) {
// 				return; // You can throw an error here if you prefer
// 			}

// 			const response = await fetch(
// 				`http://localhost:5000/api/course-schedules?day=${courseSchedule.day}&room=${courseSchedule.room}`
// 			);

// 			if (!response.ok) {
// 				throw new Error(`Failed to fetch schedules: ${response.statusText}`);
// 			}
// 			const data = await response.json();
// 			const formattedSchedules = data.map((course) => ({
// 				courseId: course.courseId, // Add the courseId to each schedule
// 				day: course.day,
// 				room: course.room,
// 				startTime: parseInt(course.startTime, 10), // Ensure it's a number
// 				endTime: parseInt(course.endTime, 10), // Ensure it's a number
// 			}));

// 			const uniqueSchedules = formattedSchedules.filter((newSchedule) => {
// 				return !schedules.some(
// 					(existingSchedule) =>
// 						existingSchedule.day === newSchedule.day &&
// 						existingSchedule.room === newSchedule.room &&
// 						existingSchedule.startTime === newSchedule.startTime &&
// 						existingSchedule.endTime === newSchedule.endTime &&
// 						existingSchedule.courseId === newSchedule.courseId // Check for courseId uniqueness
// 				);
// 			});

// 			setSchedules((prevSchedules) => [...prevSchedules, ...uniqueSchedules]);
// 		} catch (error) {
// 			// console.error('Error fetching schedules:', error);
// 			console.log('no schedule found');
// 		}
// 	};

// 	// console.log(schedules);
// 	// console.log(allCourse);

// 	return (
// 		<div className="grid grid-cols-3 h-screen gap-4 p-4 font-clash">
// 			<div className="bg-neutral-100 text-neutral-900 p-4 border border-neutral-300 shadow-sm rounded-lg">
// 				<h2 className="pl-4 font-bold text-xl">Create Set</h2>
// 				<div className="grid m-auto p-4 gap-4">
// 					<div className="grid">
// 						<p className="text-sm pb-2 font-medium">Department</p>
// 						<select
// 							name="department"
// 							value={setDetails.department}
// 							onChange={handleSetDetailsChange}
// 							id=""
// 							className="text-sm border border-neutral-300 bg-transparent rounded-md shadow-sm pl-4 p-2">
// 							<option value="" disabled>
// 								Choose department
// 							</option>
// 							<option value="BSBA HRM">BSBA HRM</option>
// 							<option value="BSBA FM">BSBA FM</option>
// 							<option value="BSA">BSA</option>
// 							<option value="BSCS">BSCS</option>
// 							<option value="BSED MATH & FIL">BSED MATH & FIL</option>
// 							<option value="BSED SOCSTUD">BSED SOCSTUD</option>
// 							<option value="BEED">BEED</option>
// 							<option value="CPE">CPE</option>
// 							<option value="BSHM">BSHM</option>
// 						</select>
// 					</div>
// 					<div className="grid">
// 						<p className="text-sm pb-2 font-medium">Year level</p>
// 						<select
// 							name="yearLevel"
// 							value={setDetails.yearLevel}
// 							onChange={handleSetDetailsChange}
// 							id=""
// 							className="text-sm pl-4 border border-neutral-300 bg-transparent  rounded-md shadow-sm p-2">
// 							<option value="" disabled>
// 								Select year level
// 							</option>
// 							<option value="1st Year">1st Year</option>
// 							<option value="2nd Year">2nd Year</option>
// 							<option value="3rd Year">3rd Year</option>
// 							<option value="4th Year">4th Year</option>
// 						</select>
// 					</div>
// 					<div className="grid">
// 						<p className="text-sm pb-2 font-medium">Semester</p>
// 						<select
// 							name="semester"
// 							value={setDetails.semester}
// 							onChange={handleSetDetailsChange}
// 							className="text-sm pl-4 border border-neutral-300 bg-transparent  rounded-md shadow-sm p-2">
// 							<option value="" disabled>
// 								Select semester
// 							</option>
// 							<option value="1st Semester">1st Semester</option>
// 							<option value="2nd Semester">2nd Semester</option>
// 						</select>
// 					</div>
// 					<div className="grid">
// 						<p className="text-sm pb-2 font-medium">Set name</p>
// 						<select
// 							name="name"
// 							id=""
// 							value={setDetails.name}
// 							onChange={handleSetDetailsChange}
// 							className="text-sm pl-4 border border-neutral-300 bg-transparent rounded-md shadow-sm p-2">
// 							<option value="" disabled>
// 								Select set letter
// 							</option>
// 							{allSet
// 								.filter((set) => !existingSet.includes(set))
// 								.map((set, index) => (
// 									<option key={index} value={set}>
// 										{set}
// 									</option>
// 								))}
// 						</select>
// 					</div>
// 				</div>

// 				<div className="flex flex-col p-4 m-auto gap-4">
// 					<h2 className="text-xl font-bold">Add Course Schedule</h2>
// 					<div className="flex w-full gap-4 items-center justify-between">
// 						<input
// 							className="text-sm pl-4 border border-neutral-300 bg-transparent  rounded-md shadow-sm p-2 min-w-12 text-center font-medium"
// 							type="text"
// 							name="courseId"
// 							placeholder="courseId"
// 							value={result?.courseId || 'Code'}
// 							onChange={handleCourseScheduleChange}
// 							disabled
// 						/>
// 						<select
// 							className="w-full text-sm pl-4 border border-neutral-300 bg-transparent  rounded-md shadow-sm p-2 block font-medium"
// 							name="courseName"
// 							value={courseSchedule.courseName}
// 							onChange={handleCourseScheduleChange}>
// 							<option value="" disabled>
// 								Select Course
// 							</option>
// 							{definedCourse.map((course, index) => (
// 								<option key={index}>{course.name}</option>
// 							))}
// 						</select>

// 						<input
// 							className="text-sm pl-4 border border-neutral-300 bg-transparent  rounded-md shadow-sm p-2 min-w-12 text-center font-medium"
// 							type="text"
// 							name="courseUnit"
// 							placeholder="courseUnit"
// 							value={result?.courseUnit || 'Units'}
// 							onChange={handleCourseScheduleChange}
// 							disabled
// 						/>
// 					</div>

// 					<select
// 						onChange={handleCourseScheduleChange}
// 						value={courseSchedule.day}
// 						name="day"
// 						className="w-full text-sm pl-4 border border-neutral-300 bg-transparent  rounded-md shadow-sm p-2 block font-medium"
// 						onClick={() => fetchSchedules()}>
// 						<option value="" disabled>
// 							Select Day
// 						</option>
// 						<option value="Mon">Monday</option>
// 						<option value="Tue">Tuesday</option>
// 						<option value="Wed">Wednesday</option>
// 						<option value="Thu">Thursday</option>
// 						<option value="Fri">Friday</option>
// 						<option value="Sat">Saturday</option>
// 					</select>
// 					<select
// 						onChange={handleCourseScheduleChange}
// 						value={courseSchedule.room}
// 						name="room"
// 						className="w-full text-sm pl-4 border border-neutral-300 bg-transparent  rounded-md shadow-sm p-2 block font-medium"
// 						onClick={() => fetchSchedules()}>
// 						<option value="" disabled>
// 							Select Room
// 						</option>
// 						<option value="VTB 8">VTB 8</option>
// 						<option value="VTB 9">VTB 9</option>
// 						<option value="VTB 10">VTB 10</option>
// 						<option value="VTB 11">VTB 11</option>
// 						<option value="VTB 12">VTB 12</option>
// 						<option value="COMLAB 1">COMLAB 1</option>
// 						<option value="COMLAB 2">COMLAB 2</option>
// 						<option value="AVR">AVR</option>
// 					</select>

// 					<div className="flex gap-4">
// 						<select
// 							name="startTime"
// 							value={courseSchedule.startTime}
// 							onChange={handleCourseScheduleChange}
// 							className="w-full text-sm pl-4 border border-neutral-300 bg-transparent  rounded-md shadow-sm p-2 block font-medium">
// 							<option value="" disabled>
// 								Select Start Time
// 							</option>
// 							{fullTimeSlots
// 								.filter(
// 									(time) =>
// 										// Filter out any time slots that match both room and day in schedules,
// 										// and also overlap with startTime and endTime ranges.
// 										!schedules.some(
// 											(f) =>
// 												f.room === courseSchedule.room &&
// 												f.day === courseSchedule.day &&
// 												time.startTime >= f.startTime &&
// 												time.endTime <= f.endTime
// 										)
// 								)
// 								.map((time, index) => (
// 									<option key={index} value={time.startTime}>
// 										{convertTo12Hour(time.startTime)}
// 									</option>
// 								))}
// 						</select>
// 						<select
// 							name="endTime"
// 							value={courseSchedule.endTime}
// 							onChange={handleCourseScheduleChange}
// 							className="w-full text-sm pl-4 border border-neutral-300 bg-transparent  rounded-md shadow-sm p-2 block font-medium">
// 							<option value="" disabled>
// 								Select End Time
// 							</option>
// 							{fullTimeSlots
// 								.filter(
// 									(time) =>
// 										// Filter out any time slots that match both room and day in schedules,
// 										// and also overlap with startTime and endTime ranges.
// 										!schedules.some(
// 											(f) =>
// 												f.room === courseSchedule.room &&
// 												f.day === courseSchedule.day &&
// 												time.startTime >= f.startTime &&
// 												time.endTime <= f.endTime
// 										)
// 								)
// 								.map((time, index) => (
// 									<option key={index} value={time.endTime}>
// 										{convertTo12Hour(time.endTime)}
// 									</option>
// 								))}
// 						</select>
// 					</div>

// 					<button
// 						onClick={addCourseSchedule}
// 						className="bg-neutral-900 p-2 w-fit rounded-md text-neutral-100 text-sm px-4 font-medium self-end">
// 						Add Course Schedule
// 					</button>
// 				</div>
// 			</div>
// 			<div className="col-span-2 p-6 bg-neutral-100 border border-neutral-300 rounded-lg relative">
// 				<div className="flex text-neutral-900 gap-4">
// 					<div className="shadow-sm bg-neutral-100 w-fit rounded p-2">
// 						<h1 className="text-xs">Department</h1>{' '}
// 						<span className="text-xl font-medium">
// 							{setDetails?.department || ''}
// 						</span>{' '}
// 					</div>
// 					<div className="shadow-sm bg-neutral-100 w-fit rounded p-2">
// 						<h1 className="text-xs">Year Lever</h1>{' '}
// 						<span className="text-xl font-medium">
// 							{setDetails?.yearLevel || ''}
// 						</span>
// 					</div>
// 					<div className="shadow-sm bg-neutral-100 w-fit rounded p-2">
// 						<h1 className="text-xs">Semester</h1>{' '}
// 						<span className="text-xl font-medium">
// 							{setDetails?.semester || ''}
// 						</span>
// 					</div>
// 					<div className="shadow-sm bg-neutral-100 w-fit rounded p-2">
// 						<h1 className="text-xs">Set Name</h1>
// 						<span className="text-xl font-medium">
// 							{setDetails?.name || ''}
// 						</span>
// 					</div>
// 				</div>
// 				<table className="min-w-full bg-white border-b border-neutral-900 text-sm mt-4">
// 					<thead className="">
// 						<tr>
// 							<th className="px-4 py-2 text-left text-neutral-500 font-medium border-neutral-300  border-b">
// 								Code
// 							</th>
// 							<th className="px-4 py-2 text-left text-neutral-500 font-medium border-neutral-300  border-b">
// 								Description
// 							</th>
// 							<th className="px-4 py-2 text-left text-neutral-500 font-medium border-neutral-300  border-b">
// 								Unit
// 							</th>
// 							<th className="px-4 py-2 text-left text-neutral-500 font-medium border-neutral-300  border-b">
// 								Time
// 							</th>
// 							<th className="px-4 py-2 text-left text-neutral-500 font-medium border-neutral-300  border-b">
// 								Day
// 							</th>
// 							<th className="px-4 py-2 text-left text-neutral-500 font-medium border-neutral-300  border-b">
// 								Room
// 							</th>
// 							<th className="px-4 py-2 text-left text-neutral-500 font-medium border-neutral-300  border-b">
// 								Actions
// 							</th>
// 						</tr>
// 					</thead>
// 					<tbody>
// 						{allCourse.map((schedule, index) => (
// 							<tr key={index} className="hover:bg-gray-100">
// 								<td className="px-4 py-2 border-b text-gray-700">
// 									{schedule.courseId}
// 								</td>
// 								<td className="px-4 py-2 border-b text-gray-700">
// 									{schedule.courseName}
// 								</td>
// 								<td className="px-4 py-2 border-b text-gray-700">
// 									{schedule.courseUnit}
// 								</td>
// 								<td className="px-4 py-2 border-b text-gray-700">
// 									{schedule.day}
// 								</td>
// 								<td className="px-4 py-2 border-b text-gray-700">
// 									{convertTo12Hour(schedule.startTime)} -{' '}
// 									{convertTo12Hour(schedule.endTime)}
// 								</td>
// 								<td className="px-4 py-2 border-b text-gray-700">
// 									{schedule.room}
// 								</td>
// 								<td className="px-4 py-2 border-b text-gray-700">
// 									<button
// 										className="p-2 rounded-md mx-1 bg-yellow-500 text-yellow-900"
// 										onClick={() => handleEdit(schedule)}>
// 										<FilePen size={18} />
// 									</button>
// 									<button
// 										onClick={() => handleDelete(schedule.courseId)}
// 										className="p-2 rounded-md mx-1 bg-red-500 text-red-900">
// 										<Trash size={18} />
// 									</button>
// 								</td>
// 							</tr>
// 						))}
// 					</tbody>
// 				</table>
// 				<button
// 					onClick={submitSetWithCourses}
// 					className="col-span-2 bg-neutral-900 px-4 py-2 text-neutral-50 rounded-md text-sm font-medium absolute bottom-4 right-4">
// 					Submit Set with Schedule
// 				</button>
// 			</div>

// 			{isModalOpen && editSchedule && (
// 				<div className="fixed inset-0 flex items-center justify-center bg-neutral-900 bg-opacity-90">
// 					<div className="bg-white p-6 rounded-md shadow-lg w-1/3">
// 						<h2 className="text-neutral-900 text-xl font-semibold mb-4">
// 							Edit Schedule
// 						</h2>
// 						<form
// 							onSubmit={(e) => {
// 								e.preventDefault();
// 								updateSchedule(editSchedule);
// 							}}>
// 							<div className="flex flex-col gap-4">

// 								<label className="text-neutral-900 text-sm font-semibold flex flex-col gap-2">
// 									Day
// 									<select
// 										onChange={(e) =>
// 											setEditSchedule({ ...editSchedule, day: e.target.value })
// 										}
// 										value={editSchedule.day}
// 										className="text-black w-full text-sm pl-4 border border-neutral-300 bg-transparent  rounded-md shadow-sm p-2 block font-medium"
// 										onClick={() => fetchSchedules()}>
// 										<option value="" disabled>
// 											Select Day
// 										</option>
// 										<option value="Mon">Monday</option>
// 										<option value="Tue">Tuesday</option>
// 										<option value="Wed">Wednesday</option>
// 										<option value="Thu">Thursday</option>
// 										<option value="Fri">Friday</option>
// 										<option value="Sat">Saturday</option>
// 									</select>
// 								</label>

// 								<label className="text-neutral-900 text-sm flex flex-col gap-2 font-semibold">
// 									{' '}
// 									Room
// 									<select
// 										onChange={(e) =>
// 											setEditSchedule({ ...editSchedule, room: e.target.value })
// 										}
// 										value={editSchedule.room}
// 										name="room"
// 										className="text-black w-full text-sm pl-4 border border-neutral-300 bg-transparent  rounded-md shadow-sm p-2 block font-medium"
// 										onClick={() => fetchSchedules()}>
// 										<option value="" disabled>
// 											Select Room
// 										</option>
// 										<option value="VTB 8">VTB 8</option>
// 										<option value="VTB 9">VTB 9</option>
// 										<option value="VTB 10">VTB 10</option>
// 										<option value="VTB 11">VTB 11</option>
// 										<option value="VTB 12">VTB 12</option>
// 										<option value="COMLAB 1">COMLAB 1</option>
// 										<option value="COMLAB 2">COMLAB 2</option>
// 										<option value="AVR">AVR</option>
// 									</select>
// 								</label>
// 								<label className="text-neutral-900 text-sm flex flex-col gap-2 font-semibold">
// 									{' '}
// 									Time
// 									<div className="flex gap-4">
// 										<select
// 											name="startTime"
// 											value={editSchedule.startTime}
// 											onChange={(e) =>
// 												setEditSchedule({
// 													...editSchedule,
// 													startTime: e.target.value,
// 												})
// 											}
// 											className="text-black w-full text-sm pl-4 border border-neutral-300 bg-transparent  rounded-md shadow-sm p-2 block font-medium">
// 											<option value="" disabled>
// 												Select Start Time
// 											</option>
// 											{fullTimeSlots
// 												.filter(
// 													(time) =>
// 														// Filter out any time slots that match both room and day in schedules,
// 														// and also overlap with startTime and endTime ranges.
// 														!schedules.some(
// 															(f) =>
// 																f.room === courseSchedule.room &&
// 																f.day === courseSchedule.day &&
// 																time.startTime >= f.startTime &&
// 																time.endTime <= f.endTime
// 														)
// 												)
// 												.map((time, index) => (
// 													<option key={index} value={time.startTime}>
// 														{convertTo12Hour(time.startTime)}
// 													</option>
// 												))}
// 										</select>
// 										<select
// 											name="endTime"
// 											value={editSchedule.endTime}
// 											onChange={(e) =>
// 												setEditSchedule({
// 													...editSchedule,
// 													endTime: e.target.value,
// 												})
// 											}
// 											className="text-black w-full text-sm pl-4 border border-neutral-300 bg-transparent  rounded-md shadow-sm p-2 block font-medium">
// 											<option value="" disabled>
// 												Select End Time
// 											</option>
// 											{fullTimeSlots
// 												.filter(
// 													(time) =>
// 														!schedules.some(
// 															(f) =>
// 																f.room === courseSchedule.room &&
// 																f.day === courseSchedule.day &&
// 																time.startTime >= f.startTime &&
// 																time.endTime <= f.endTime
// 														)
// 												)
// 												.map((time, index) => (
// 													<option key={index} value={time.endTime}>
// 														{convertTo12Hour(time.endTime)}
// 													</option>
// 												))}
// 										</select>
// 									</div>
// 								</label>
// 							</div>

// 							<div className="mt-8 flex justify-end">
// 								<button
// 									type="button"
// 									onClick={closeModal}
// 									className="text-gray-500 mr-4 text-sm">
// 									Cancel
// 								</button>
// 								<button
// 									type="submit"
// 									className="text-white bg-neutral-950 text-sm font-medium px-4 py-2 rounded">
// 									Save
// 								</button>
// 							</div>
// 						</form>
// 					</div>
// 				</div>
// 			)}
// 		</div>
// 	);
// };

// export default SetGenerator;