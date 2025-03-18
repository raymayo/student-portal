import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Replace with your actual API URL

const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        return { error: error.response?.data?.message || "Registration failed" };
    }
};

const StudentRegistration = () => {
    const [student, setStudent] = useState({
        studentId: "",
        name: "",
        email: "",
        phone: "",
        birthday: "",
        gender: "",
        address: "",
        password: "",
        department: "",
        yearLevel: "",
        role: "student",
    });

    const [message, setMessage] = useState("");

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
            setMessage("Teacher registered successfully!");
            setStudent({
                studentId: "",
                name: "",
                email: "",
                phone: "",
                birthday: "",
                gender: "",
                address: "",
                password: "",
                department: "",
                yearLevel: "",
                role: "student",
            });
        }
    };

    return (
        <form
            className="p-6 bg-white rounded-md w-full max-w-[800px] flex flex-col gap-4"
            onSubmit={handleSubmit}
        >
             <div className='mb-6'>
                    <h1 className="text-xl font-semibold">Student Registration</h1>
                    <p className='text-sm text-zinc-500'>Complete the Form to register teacher</p>
                </div>
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
                        className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
                    >
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
                    <h1 className="text-sm font-medium">Department</h1>
                    <input
                        type="text"
                        name="department"
                        value={student.department}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
                    />
                </label>
                <label className="w-full flex flex-col gap-1">
                    <h1 className="text-sm font-medium">Year Level</h1>
                    <input
                        type="text"
                        name="yearLevel"
                        value={student.yearLevel}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-slate-200 shadow-2xs rounded-md"
                    />
                </label>
            </div>
            <button
                type="submit"
                className="bg-zinc-900 text-white px-3 py-2 rounded-md w-full mt-8 text-sm font-medium cursor-pointer"
            >
                Register Student
            </button>

            {message && <p className="text-sm text-center text-red-600">{message}</p>}
        </form>
    );
};

export default StudentRegistration;
