import './App.css';
import React from 'react';
import Login from './frontend/pages/Login.jsx';
import { AuthProvider } from './frontend/context/AuthContext';
import ProtectedRoute from './frontend/components/ProtectedRoutes';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StudentDashboard from './frontend/pages/StudentDashboard.jsx';
import TeacherDashboard from './frontend/pages/TeacherDashboard.jsx';
import AdminPanel from './frontend/pages/AdminPanel.jsx';

function App() {
	return (
		<Router> {/* ✅ Ensure Router wraps everything */}
			<AuthProvider>
				<div className="min-w-dvw min-h-dvh w-dvw h-dvh bg-white">
					<Routes>
						{/* ✅ Add explicit login route */}
						<Route path="/" element={<Navigate to="/login" />} />
						<Route path="/login" element={<Login />} />

						{/* ✅ Protected routes */}
						<Route element={<ProtectedRoute allowedRoles={['student']} />}>
							<Route path="/dashboard/:studentId" element={<StudentDashboard />} />
						</Route>

						<Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
							<Route path="/teacher-dashboard/:teacherId" element={<TeacherDashboard />} />
						</Route>

						<Route element={<ProtectedRoute allowedRoles={['admin']} />}>
							<Route path="/admin/*" element={<AdminPanel />} />
						</Route>

						{/* ✅ Catch-all for unmatched routes */}
						<Route path="*" element={<Navigate to="/login" />} />
					</Routes>
				</div>
			</AuthProvider>
		</Router>
	);
}

export default App;
