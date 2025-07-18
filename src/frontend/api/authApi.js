/* eslint-disable no-unused-vars */
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Adjust based on backend URL

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || "Registration failed" };
  }
};

// Login User
export const loginUser = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, formData, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("API Response:", response.data); // ✅ Debug full API response

    localStorage.setItem("token", response.data.token);
    // Don't store role separately; it's already in user

    return { user: response.data.user, token: response.data.token };
  } catch (error) {
    return { error: error.response?.data?.message || "Login failed" };
  }
};


// Get User Profile
export const getUserProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return { error: "Unauthorized" };
  }
};
