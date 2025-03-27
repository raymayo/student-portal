import React from "react";
import { useState, useContext } from "react";
import { loginUser } from "../api/authApi.js"; // API call
import AuthContext from "../context/AuthContext.jsx"; // Auth context
import { useNavigate } from "react-router-dom";

import { GraduationCap } from "lucide-react";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: "admin", // Default selection
    email: "ray@admin.com",
    password: "admin",
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
          navigate(`/dashboard/${data.user._id}`);
          break;
        case "teacher":
          navigate(`/teacher-dashboard/${data.user._id}`);
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
    <main className="flex h-full w-full flex-col items-center justify-center gap-4 bg-zinc-100">
      {/* <div className="flex gap-1.5 items-center">
                <div className=" p-1 rounded-lg bg-primary text-zinc-900">
                <GraduationCap size={18}/>
                </div>
                <h1 className="font-medium">Student Portal</h1>
            </div> */}
      <div className="grid h-full max-h-[500px] w-full max-w-[800px] grid-cols-2 rounded-xl border border-zinc-200 bg-white shadow-md">
        <div
          id="image-holder"
          className="relative grid place-items-center rounded-l-xl"
        >
          {/* <h1 className="text-black font-semibold text-xl absolute top-5 left-5 w-1/3">Student Portal</h1> */}
          {/* <img src="../../../public/UI/book.svg" alt="" className='border'/> */}
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-r-xl bg-white p-8"
        >
          <div className="flex flex-col items-center justify-center gap-0 text-center">
            <h1 className="text-xl font-semibold">Welcome back</h1>
            <p className="w-5/6 text-center text-sm text-neutral-500">
              Enter your credentials below to sign in to your account
            </p>
          </div>
          {error && <p className="text-red-500">{error}</p>}

          <div className="mt-4 flex w-full flex-col gap-6">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full cursor-pointer rounded-md border border-zinc-200 bg-white px-3 py-1.5 shadow-2xs"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>

            <label className="flex w-full flex-col gap-2">
              <h1 className="text-sm font-medium">Email</h1>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-md border border-zinc-200 bg-white px-3 py-1.5 shadow-2xs"
                required
              />
            </label>

            <label className="flex w-full flex-col gap-2">
              <h1 className="text-sm font-medium">Password</h1>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-md border border-zinc-200 bg-white px-3 py-1.5 shadow-2xs"
                required
              />
            </label>

            <button
              type="submit"
              className="w-full cursor-pointer rounded-lg border bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-100 shadow-2xs"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;
