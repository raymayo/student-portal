import { useState } from "react";
import axios from "axios";
import Toaster from "../Toaster";
import { X } from 'lucide-react';

const API_URL = "http://localhost:5000/api/auth"; // Replace with your actual API URL

const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || "Registration failed" };
    }
};

const StudentRegistrationModal = ({ isOpen, onClose }) => {

    const [toast, setToast] = useState({ message: "", type: "" });
    const showToast = (message, type) => {
        setToast({ message, type });
      };

    const [student, setStudent] = useState({
        studentId: "",
        name: "",
        email: "",
        phone: "",
        birthday: "",
        gender: "",
        address: "",
        password: "",
        areaOfStudy: "",
        yearLevel: "",
        department: "",
        role: "student",
    });

    const [message, setMessage] = useState("");

    if (!isOpen) return null; // Don't render if modal is closed

    const handleChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("Registering...");

        const response = await registerUser(student);
        if (response.error) {
            setMessage(response.error);
        } else {
            setMessage("Student registered successfully!");
            setStudent({
                studentId: "",
                name: "",
                email: "",
                phone: "",
                birthday: "",
                gender: "",
                address: "",
                password: "",
                areaOfStudy: "",
                yearLevel: "",
                department: "",
                role: "student",
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-zinc-950/75 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md w-full max-w-2xl">
                <div className="flex justify-between items-start pl-6">
                    <div className="flex flex-col">
                    <h1 className="text-xl font-semibold">Student Registration</h1>
                    <p className="text-sm text-zinc-500">
					Complete the Form to register teacher
				</p>
                </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-900 cursor-pointer"><X size={16}/></button>
                </div>

                <form
			className="p-6 bg-white rounded-md w-full max-w-[800px] flex flex-col gap-4"
			onSubmit={handleSubmit}>
			<div className="flex gap-2">
				<label className="w-full flex flex-col gap-1 max-w-[150px]">
					<h1 className="text-sm font-medium">Student Id</h1>
					<input
						type="text"
						name="studentId"
						value={student.studentId}
						onChange={handleChange}
						className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
					/>
				</label>
				<label className="w-full flex flex-col gap-1 ">
					<h1 className="text-sm font-medium">Name</h1>
					<input
						type="text"
						name="name"
						value={student.name}
						onChange={handleChange}
						className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
					/>
				</label>
			</div>
			<label className="w-full flex flex-col gap-1">
				<h1 className="text-sm font-medium">Email</h1>
				<input
					type="email"
					name="email"
					value={student.email}
					onChange={handleChange}
					className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
				/>
			</label>
			<div className="flex gap-2">
				<label className="w-full flex flex-col gap-1">
					<h1 className="text-sm font-medium">Phone</h1>
					<input
						type="text"
						name="phone"
						value={student.phone}
						onChange={handleChange}
						maxLength={11}
						placeholder="ex. 09123456789"
						className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
					/>
				</label>
				<label className="w-full flex flex-col gap-1">
					<h1 className="text-sm font-medium">Birthday</h1>
					<input
						type="date"
						name="birthday"
						value={student.birthday}
						onChange={handleChange}
						className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
					/>
				</label>
				<label className="w-full flex flex-col gap-1">
					<h1 className="text-sm font-medium">Gender</h1>
					<select
						name="gender"
						value={student.gender}
						onChange={handleChange}
						className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md">
						<option value="">Select</option>
						<option value="Male">Male</option>
						<option value="Female">Female</option>
						<option value="Other">Other</option>
					</select>
				</label>
			</div>
			<label className="w-full flex flex-col gap-1">
				<h1 className="text-sm font-medium">Address</h1>
				<input
					type="text"
					name="address"
					value={student.address}
					onChange={handleChange}
					className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
				/>
			</label>
			<label className="w-full flex flex-col gap-1">
				<h1 className="text-sm font-medium">Password</h1>
				<input
					type="password"
					name="password"
					value={student.password}
					onChange={handleChange}
					className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
				/>
			</label>
			<div className="flex gap-2">
				<label className="w-full flex flex-col gap-1">
					<h1 className="text-sm font-medium">Course</h1>

					<select
						name="areaOfStudy"
						value={student.areaOfStudy}
						onChange={handleChange}
						className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
						required>
						<option value="" disabled>
							Select Course
						</option>
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
                <h1 className="text-sm font-medium">Year Level</h1>
					<select
                        name="yearLevel"
                        value={student.yearLevel}
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
			</div>
			<button
				// type="submit"
                onClick={() => showToast("User registered successfully!", "success")}
				className="bg-zinc-900 text-white px-3 py-2 rounded-md w-full mt-8 text-sm font-medium cursor-pointer">
				Register Student
			</button>

			{message && <p className="text-sm text-center text-red-600">{message}</p>}
            {toast.message && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "" })}
        />
      )}
		</form>
            </div>
        </div>
    );
};

export default StudentRegistrationModal;
