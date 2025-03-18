import React from "react";
import { useState, useContext } from "react";
import { loginUser } from "../api/authApi.js"; // API call
import AuthContext from "../context/AuthContext.jsx"; // Auth context
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        role: "admin", // Default selection
        email: "ray@admin.com",
        password: "admin"
    });
    const [error, setError] = useState("");

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await loginUser(formData);
        if (data.error) {
            setError(data.error);
        } else {
            login(data.user, data.token); // Store user data & token
            console.log("Logged in user:", data.user); // ✅ Debugging
            switch (data.user.role) {
                case "student":
                    navigate("/dashboard");
                    break;
                case "teacher":
                    navigate("/teacher-dashboard");
                    break;
                case "admin":
                    navigate("/admin/dashboard");
                    break;
                default:
                    navigate("/unauthorized");
            }
        }
    };

    return (
        <main className="h-full w-full bg-midnight grid grid-cols-2">
            <div className="bg-zinc-900 p-6">
                <h1 className="text-white font-medium text-3xl">Acadex</h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-4 p-6">
                <h1 className="font-bold text-2xl">Sign In</h1>
                <p className="text-sm text-neutral-500">
                    Enter your credentials below to sign in to your account
                </p>
                {error && <p className="text-red-500">{error}</p>}

                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="px-3 py-1.5 rounded-md bg-white border border-zinc-200 shadow-2xs w-full max-w-[400px] cursor-pointer"
                >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                </select>

                <label className="w-full max-w-[400px]">
                    <h1>Email</h1>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="px-3 py-1.5 rounded-md bg-white border border-zinc-200 w-full shadow-2xs"
                        required
                    />
                </label>

                <label className="w-full max-w-[400px]">
                    <h1>Password</h1>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="px-3 py-1.5 rounded-md bg-white border border-zinc-200 w-full shadow-2xs"
                        required
                    />
                </label>

                <button type="submit" className="px-3 py-2 rounded-md bg-black border text-white text-sm w-full max-w-[400px] shadow-2xs cursor-pointer">
                    Sign In
                </button>
            </form>
        </main>
    );
};

export default Login;
