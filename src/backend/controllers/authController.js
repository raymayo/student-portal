/* eslint-disable no-undef */
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
    try {
        let { name, email, password, role, studentId, teacherId, phone, birthday, gender, address, department, specialization, yearLevel, areaOfStudy} = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Ensure only the correct fields are stored based on role
        const userData = {
            name,
            email,
            password: hashedPassword,
            role,
        };

        if (role === "student") {
            userData.studentId = studentId;
            userData.phone = phone;
            userData.birthday = birthday;
            userData.gender = gender;
            userData.address = address;
            userData.department = department;
            userData.yearLevel = yearLevel
            userData.areaOfStudy = areaOfStudy
        } 
        else if (role === "teacher") {
            userData.teacherId = teacherId;
            userData.phone = phone;
            userData.birthday = birthday;
            userData.gender = gender;
            userData.address = address;
            userData.department = department;
            userData.specialization = specialization;
        }
        // Admins should not have studentId or teacherId
        console.log("Incoming Request:", req.body);

        // Create new user
        const newUser = new User(userData);

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};







// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // ✅ Include user object in the response
        res.status(200).json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};








// GET USER PROFILE (Protected)
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
