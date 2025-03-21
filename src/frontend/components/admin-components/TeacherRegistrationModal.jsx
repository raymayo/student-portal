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

const TeacherRegistrationModal = ({ isOpen, onClose }) => {

    const [toast, setToast] = useState({ message: "", type: "" });
    const showToast = (message, type) => {
        setToast({ message, type });
      };

    const [teacher, setTeacher] = useState({
        teacherId: "",
        name: "",
        email: "",
        phone: "",
        birthday: "",
        gender: "",
        address: "",
        password: "",
        department: "",
        specialization: "",
        role: "teacher",
    });

    const [message, setMessage] = useState("");

    if (!isOpen) return null; // Don't render if modal is closed

    const handleChange = (e) => {
        setTeacher({ ...teacher, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("Registering...");

        const response = await registerUser(teacher);
        if (response.error) {
            setMessage(response.error);
        } else {
            setMessage("Teacher registered successfully!");
            setTeacher({
                teacherId: "",
                name: "",
                email: "",
                phone: "",
                birthday: "",
                gender: "",
                address: "",
                password: "",
                department: "",
                specialization: "",
                role: "teacher",
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-zinc-950/75 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-md w-full max-w-2xl">
            <div className="flex justify-between items-start pl-6">
                <div className="flex flex-col">
                <h1 className="text-xl font-semibold">Teacher Registration</h1>
                <p className="text-sm text-zinc-500">
                Complete the Form to register teacher
            </p>
            </div>
                <button onClick={onClose} className="text-zinc-500 hover:text-zinc-900 cursor-pointer"><X size={16}/></button>
            </div>

        <form
            className="p-6 bg-white rounded-md w-full max-w-[800px] flex flex-col gap-4"
            onSubmit={handleSubmit}
        >
             {/* <div className='mb-6'>
                    <h1 className="text-xl font-semibold">Teacher Registration</h1>
                    <p className='text-sm text-zinc-500'>Complete the Form to register teacher</p>
                </div> */}
            <div className="flex gap-2">
                <label className="w-full flex flex-col gap-1 max-w-[150px]">
                    <h1 className="text-sm font-medium">Teacher Id</h1>
                    <input
                        type="text"
                        name="teacherId"
                        value={teacher.teacherId}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
                    />
                </label>
                <label className="w-full flex flex-col gap-1 ">
                    <h1 className="text-sm font-medium">Name</h1>
                    <input
                        type="text"
                        name="name"
                        value={teacher.name}
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
                    value={teacher.email}
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
                        value={teacher.phone}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
                    />
                </label>
                <label className="w-full flex flex-col gap-1">
                    <h1 className="text-sm font-medium">Birthday</h1>
                    <input
                        type="date"
                        name="birthday"
                        value={teacher.birthday}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
                    />
                </label>
                <label className="w-full flex flex-col gap-1">
                    <h1 className="text-sm font-medium">Gender</h1>
                    <select
                        name="gender"
                        value={teacher.gender}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
                    >
                        <option value="" disabled>Select</option>
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
                    value={teacher.address}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
                />
            </label>
            <label className="w-full flex flex-col gap-1">
                <h1 className="text-sm font-medium">Password</h1>
                <input
                    type="password"
                    name="password"
                    value={teacher.password}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
                />
            </label>
            <div className="flex gap-2">
                <label className="w-full flex flex-col gap-1">
                    <h1 className="text-sm font-medium">Department</h1>
                    				<select
                    name="department"
                    value={teacher.department}
					onChange={handleChange}
                    	className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
					required>
                    <option value="">Department</option>
					<option value="Computer Science">Hackers</option>
					<option value="Business Education">Executives</option>
					<option value="Hospitality Management">Hoteliers</option>
					<option value="Teacher Education">Headmasters</option>
				</select>
                </label>
                <label className="w-full flex flex-col gap-1">
                    <h1 className="text-sm font-medium">Specialization</h1>
                    <input
                        type="text"
                        name="specialization"
                        value={teacher.specialization}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
                    />
                </label>
            </div>
            <button
                type="submit"
                className="bg-primary text-zinc-950 px-3 py-2 rounded-md w-full mt-8 text-sm font-semibold cursor-pointer"
            >
                Create Teacher
            </button>

            <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "" })}
        />
        </form>
        </div>
        </div>
    );
};

export default TeacherRegistrationModal;
