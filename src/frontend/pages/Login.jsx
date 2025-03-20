import React from 'react';
import { useState, useContext } from 'react';
import { loginUser } from '../api/authApi.js'; // API call
import AuthContext from '../context/AuthContext.jsx'; // Auth context
import { useNavigate } from 'react-router-dom';

import { GraduationCap } from 'lucide-react';

const Login = () => {
	const { login } = useContext(AuthContext);
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		role: 'admin', // Default selection
		email: 'ray@admin.com',
		password: 'admin',
	});
	const [error, setError] = useState('');

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
			console.log('Logged in user:', data.user); // ✅ Debugging
			switch (data.user.role) {
				case 'student':
					navigate('/dashboard');
					break;
				case 'teacher':
					navigate('/teacher-dashboard');
					break;
				case 'admin':
					navigate('/admin/dashboard');
					break;
				default:
					navigate('/unauthorized');
			}
		}
	};

	return (
		<main className="h-full w-full bg-zinc-100 flex flex-col justify-center items-center gap-4">
			{/* <div className="flex gap-1.5 items-center">
                <div className=" p-1 rounded-lg bg-primary text-zinc-900">
                <GraduationCap size={18}/>
                </div>
                <h1 className="font-medium">Student Portal</h1>
            </div> */}
			<div className='grid grid-cols-2 w-full max-w-[800px] h-full max-h-[500px] shadow-md rounded-xl bg-white border border-zinc-200'>
				<div id='image-holder' className="rounded-l-xl grid place-items-center relative">
					{/* <h1 className="text-black font-semibold text-xl absolute top-5 left-5 w-1/3">Student Portal</h1> */}
                    {/* <img src="../../../public/UI/book.svg" alt="" className='border'/> */}
				</div>
				<form
					onSubmit={handleSubmit}
					className="w-full flex flex-col justify-center items-center gap-2 p-8 bg-white rounded-r-xl">
					<div className="flex flex-col gap-0 text-center justify-center items-center">
						<h1 className="font-semibold text-xl">Welcome back</h1>
						<p className="text-sm text-neutral-500 w-5/6 text-center">
							Enter your credentials below to sign in to your account
						</p>
					</div>
					{error && <p className="text-red-500">{error}</p>}

					<div className="mt-4 w-full flex flex-col gap-6">
						<select
							name="role"
							value={formData.role}
							onChange={handleChange}
							className="px-3 py-1.5 rounded-md bg-white border border-zinc-200 shadow-2xs w-full cursor-pointer">
							<option value="student">Student</option>
							<option value="teacher">Teacher</option>
							<option value="admin">Admin</option>
						</select>

						<label className="w-full flex flex-col gap-2">
							<h1 className="text-sm font-medium">Email</h1>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								className="px-3 py-1.5 rounded-md bg-white border border-zinc-200 w-full shadow-2xs"
								required
							/>
						</label>

						<label className="w-full flex flex-col gap-2">
							<h1 className="text-sm font-medium">Password</h1>
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								className="px-3 py-1.5 rounded-md bg-white border border-zinc-200 w-full shadow-2xs"
								required
							/>
						</label>

						<button
							type="submit"
							className="px-3 py-2 rounded-lg font-medium bg-zinc-900 border text-zinc-100 text-sm w-full shadow-2xs cursor-pointer">
							Login
						</button>
					</div>
				</form>
			</div>
		</main>
	);
};

export default Login;
