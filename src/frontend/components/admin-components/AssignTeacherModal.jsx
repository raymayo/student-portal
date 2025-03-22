import { useState, useEffect, useMemo } from 'react';
import useFormatTime from '../../custom-hooks/useFormatTime.js';
import axios from 'axios';

const AssignTeacherModal = ({ isOpen, onClose, teacher }) => {
	if (!isOpen || !teacher) return null;

    	const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        axios
        .get('https://localhost:5000/api/schedules/raw')
        .then((res) => {
            if (Array.isArray(res.data)) {
                setSchedules(res.data);
            } else {
                console.error('Expected an array, but received:', res.data);
                setSchedules([]);
            }
        })
        .catch((err) => {
            console.error(err)
            setSchedules([])
        })
    }, [])



	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/75 z-50">
			<div className="bg-white p-6 rounded-md max-w-[1500px] w-full shadow-lg h-full max-h-[800px] flex flex-col justify-between"></div>
		</div>

	);
};

export default AssignTeacherModal;
