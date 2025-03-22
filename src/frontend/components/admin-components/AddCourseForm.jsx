import { useState } from 'react';
import axios from 'axios';
import Modal from '../Modal'; // Import Modal component

const AddCourseForm = () => {
	const [formData, setFormData] = useState({
		courseId: '',
		courseName: '',
		courseUnit: '',
		areaOfStudy: '',
		semester: '',
		yearLevel: '',
	});

	const [modal, setModal] = useState({
		isOpen: false,
		title: '',
		message: '',
		type: '',
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setModal({ isOpen: false, title: '', message: '', type: '' });

		try {
			await axios.post('http://localhost:5000/api/courses', formData, {
				headers: { 'Content-Type': 'application/json' },
			});

			setModal({
				isOpen: true,
				title: 'Success',
				message: 'Course added successfully!',
				type: 'success',
			});

			setFormData({
				courseId: '',
				courseName: '',
				courseUnit: '',
				areaOfStudy: '',
				semester: '',
				yearLevel: '',
			});
		} catch (error) {
			setModal({
				isOpen: true,
				title: '❌ Error',
				message: error.response?.data?.error || 'Failed to add course',
				type: 'error',
			});
		}
	};

	return (
		<div className="p-6 bg-white shadow-md rounded-md border border-gray-300 w-full max-w-[600px]">
			<h2 className="text-xl font-semibold mb-4">Add New Course</h2>

			{/* Modal */}
			<Modal
				isOpen={modal.isOpen}
				onClose={() => setModal({ isOpen: false })}
				title={modal.title}
				message={modal.message}
				type={modal.type}
			/>

			<form onSubmit={handleSubmit} className="space-y-4">
				<label className="w-full flex flex-col gap-1">
				<h1 className="text-sm font-medium">Course Info</h1>
					<div className="flex gap-2">
						
						<input
							type="text"
							name="courseId"
							value={formData.courseId}
							onChange={handleChange}
							placeholder="Course ID"
							className="w-full max-w-[130px] p-2 border border-gray-300 rounded"
							required
						/>
						<input
							type="text"
							name="courseName"
							value={formData.courseName}
							onChange={handleChange}
							placeholder="Course Name"
							className="w-full max-w-[500px] p-2 border border-gray-300 rounded"
							required
						/>
						<input
							type="number"
							name="courseUnit"
							value={formData.courseUnit}
							onChange={handleChange}
							placeholder="Units"
							className="w-full max-w-[60px] p-2 border border-gray-300 rounded"
							required
						/>
					</div>
				</label>

				<label className="w-full flex flex-col gap-1">
				<h1 className="text-sm font-medium">Area Of Study</h1>
					<select
						name="areaOfStudy"
						value={formData.areaOfStudy}
						onChange={handleChange}
						className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
						required>
						<option value="">Area of Study</option>
						<option value="BSBA HRM">BSBA HRM</option>
						<option value="BSBA FM">BSBA FM</option>
						<option value="BSA">BSA</option>
						<option value="BSCS">BSCS</option>
						<option value="BSED MATH & FIL">BSED MATH & FIL</option>
						<option value="BSED SOCSTUD">BSED SOCSTUD</option>
						<option value="BEED">BEED</option>
						<option value="CPE">CPE</option>
						<option value="BSHM">BSHM</option>
					</select>
				</label>
				<label className="w-full flex flex-col gap-1">
				<h1 className="text-sm font-medium">Semester</h1>
					<select
						name="semester"
						value={formData.semester}
						onChange={handleChange}
						className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
						required>
						<option value="">Select Semester</option>
						<option value="1st Semester">1st Semester</option>
						<option value="2nd Semester">2nd Semester</option>
						<option value="Summer">Summer</option>
						<option value="Januarian">Januarian</option>
						<option value="Octoberian">Octoberian</option>
					</select>
				</label>
				<label className="w-full flex flex-col gap-1">
				<h1 className="text-sm font-medium">Year Level</h1>
					<select
						name="yearLevel"
						value={formData.yearLevel}
						onChange={handleChange}
						className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
						required>
						<option value="">Select Year Level</option>
						<option value="1">1st Year</option>
						<option value="2">2nd Year</option>
						<option value="3">3rd Year</option>
						<option value="4">4th Year</option>
					</select>
				</label>

				<button
					type="submit"
					className="bg-zinc-900 text-white px-3 py-2 rounded-md w-full mt-8 text-sm font-medium cursor-pointer">
					Add Course
				</button>
			</form>
		</div>
	);
};

export default AddCourseForm;
