import axios from "axios";

const API_URL = "http://localhost:5000/api/grades"; // Update this if needed

// Function to create a grade document
export const createGrade = async (studentId, scheduleId, token) => {
    try {
        const response = await axios.post(
            `${API_URL}/${studentId}/${scheduleId}`,
            {}
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to create grade document.";
    }
};
