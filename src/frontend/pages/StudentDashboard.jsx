import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFormatTime from '../custom-hooks/useFormatTime.js';
import axios from 'axios';

const StudentDashboard = () => {
	const { studentId } = useParams();
	const [grades, setGrades] = useState([]);

	const { formatTime } = useFormatTime();

	function GPA(percentage) {
		if (percentage >= 96) return 1.0;
		if (percentage >= 93) return 1.25;
		if (percentage >= 90) return 1.5;
		if (percentage >= 87) return 1.75;
		if (percentage >= 84) return 2.0;
		if (percentage >= 81) return 2.25;
		if (percentage >= 78) return 2.5;
		if (percentage >= 75) return 2.75;
		if (percentage >= 70) return 3.0;
		return 5.0; // Failing grade
	}

	const calculateFinalGrade = (prelim, midterm, finals) => {
		return prelim * 0.3 + midterm * 0.3 + finals * 0.4;
	};

	useEffect(() => {
		axios
			.get(`http://localhost:5000/api/grades/${studentId}`)
			.then((res) => {
				if (Array.isArray(res.data)) {
					setGrades(res.data);
				} else {
					console.error('Expected an array, but received:', res.data);
					setSchedules([]);
				}
			})
			.catch((err) => {
				console.error(err);
				setGrades([]);
			});
	}, []);

	console.log();

	return (
		<div className="w-full h-full flex flex-col items-center p-6">
			<div className='flex gap-1 items-center justify-center'>
				<h1 className='text-xl font-bold'>{grades[0].student.name}'s</h1>
				<h1>Grades</h1>
			</div>

			<div className="border border-zinc-300 rounded-md bg-white w-3/5 h-full">
				<table className="w-full h-fit">
					<thead>
						<tr>
							<th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
								#
							</th>
							<th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
								Subject
							</th>
							<th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
								Schedule
							</th>
							<th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
								Adviser
							</th>
							<th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
								Prelim
							</th>
							<th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
								Midterm
							</th>
							<th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
								Finals
							</th>
							<th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
								Equivalent
							</th>
							<th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
								Remarks
							</th>
						</tr>
					</thead>
					<tbody>
						{grades.map((grade, index) => (
							<tr key={index}>
								<td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
									{index + 1}
								</td>
								<td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
									{grade.schedule.course.courseId} -{' '}
									{grade.schedule.course.courseName}
								</td>
								<td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
									{grade.schedule.day} {formatTime(grade.schedule.startTime)} -{' '}
									{formatTime(grade.schedule.endTime)}
								</td>
								<td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
									{grade.teacher.name || 'N/A'}
								</td>
								<td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
									{grade.termGrades.prelim || 'N/A'}
								</td>
								<td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
									{grade.termGrades.midterm || 'N/A'}
								</td>
								<td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
									{grade.termGrades.finals || 'N/A'}
								</td>
								<td className="border-y border-zinc-200 px-4 py-3 text-left text-sm">
									{GPA(
										calculateFinalGrade(
											grade.termGrades.prelim,
											grade.termGrades.midterm,
											grade.termGrades.finals
										)
									) || 'N/A'}
								</td>
								<td className="border-y border-zinc-200 px-4 py-3 text-left text-sm text-primary">
									PASSED
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default StudentDashboard;
