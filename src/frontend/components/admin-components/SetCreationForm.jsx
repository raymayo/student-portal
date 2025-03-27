import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const SetCreationForm = () => {
	const allYear = ['2024', '2025', '2026', '2027', '2028', '2029', '2030'];

	const [set, setSet] = useState({
		department: '',
		areaOfStudy: '',
		yearLevel: '',
		setName: '',
		academicYear: '',
		semester: '',
		schedules: [],
	});

	const { yearLevel, areaOfStudy } = set || {};

	useEffect(() => {
		if (!yearLevel || !areaOfStudy) return;

		const fetchScheduleByCourse = async () => {
			try {
				const { data } = await axios.get(
					`http://localhost:5000/api/courses/filter?yearLevel=${yearLevel}&areaOfStudy=${areaOfStudy}`
				);

				console.log(data);
			} catch (error) {
				console.log(error);
			}
		};

		fetchScheduleByCourse();
	}, [yearLevel, areaOfStudy]);


	const handleChange = (e) => {
		setSet({
			...set,
			[e.target.name]: e.target.value,
		});
	};
    

	return (
		<div className="w-full h-full grid grid-cols-2 gap-6">
			<form>
				<label className="w-full flex flex-col gap-1">
					<h1 className="text-sm font-medium">Department</h1>
					<select
						name="department"
						value={set.department}
						onChange={handleChange}
						className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md">
						Department
					</select>
				</label>
				<label className="w-full flex flex-col gap-1">
					<h1 className="text-sm font-medium">areaOfStudy</h1>
					<select
						name="areaOfStudy"
						value={set.areaOfStudy}
						onChange={handleChange}
						className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md">
						Course
					</select>
				</label>
				<label className="w-full flex flex-col gap-1">
					<h1 className="text-sm font-medium">Year Level</h1>
					<select
						name="yearLevel"
						value={set.yearLevel}
						onChange={handleChange}
						className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md">
						Year Level
					</select>
				</label>
				<label className="w-full flex flex-col gap-1">
					<h1 className="text-sm font-medium">Set Name</h1>
					<select
						name="setName"
						value={set.setName}
						onChange={handleChange}
						className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md">
						Year Level
					</select>
				</label>
				<label className="w-full flex flex-col gap-1">
					<h1 className="text-sm font-medium">Semester</h1>
					<select
						name="semester"
						value={set.semester}
						onChange={handleChange}
						className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md">
						Year Level
					</select>
				</label>
				<div>
					<h1 className="text-sm font-medium mb-1">Academic Year</h1>
					<label className="w-full flex gap-2">
						<select
							name="yearStart"
							required
							className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"></select>
						<select
							name="yearEnd"
							required
							className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"></select>
					</label>
				</div>

				<div className="mt-6">
					<h1 className="text-xl font-medium">Add Schedule to Set</h1>
					<label className="w-full flex flex-col gap-1">
						<h1 className="text-sm font-medium">Pick Course</h1>
						<select
							name=""
							className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md">
							Course
						</select>
					</label>
					<button>add schedule</button>
				</div>
			</form>

			<div>
				<h1 className="text-xl font-medium">List of Schedule</h1>
				<div>
					<table></table>
				</div>
			</div>
		</div>
	);
};

export default SetCreationForm;
