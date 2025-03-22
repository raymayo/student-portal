import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
	const { studentId } = useParams(); 
	const [grades, setGrades] = useState([]);

  const calculateFinalGrade = (prelim, midterm, finals) => {
    return (prelim * 0.30) + (midterm * 0.30) + (finals * 0.40);
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

	console.log(grades);

	return (
		<div>
			<div className="border border-zinc-300 rounded-md h-fit bg-white">
				<table className="w-full h-full">
					<thead>
						<tr>
							<th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
								#
							</th>
							<th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500">
								Subject
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
								<td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
									{index + 1}
								</td>
								<td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
								{grade.schedule.course.courseId} - {grade.schedule.course.courseName}
								</td>
								<td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
                {grade.termGrades.prelim || "N/A"}
								</td>
								<td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
                {grade.termGrades.midterm || "N/A"}
								</td>
								<td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
                {grade.termGrades.finals || "N/A"}
								</td>
								<td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
									{calculateFinalGrade(grade.termGrades.prelim, grade.termGrades.midterm, grade.termGrades.finals) || "N/A"}
								</td>
                <td className="border-t border-zinc-300 px-4 py-3 text-left text-sm">
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
