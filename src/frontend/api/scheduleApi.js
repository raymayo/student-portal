import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // Update this if deployed

export const generateSchedule = async () => {
    try {
        const response = await axios.post(`${API_BASE_URL}/schedule/generate`);
        return response.data; // Assuming the response contains the generated schedule
    } catch (error) {
        console.error("Error generating schedule:", error.response?.data || error.message);
        throw error;
    }
};
