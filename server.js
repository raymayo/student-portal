/* eslint-disable no-undef */
import express from 'express';
import dotenv from  'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from "./src/backend/routes/authRoutes.js";
import scheduleRoutes from "./src/backend/routes/scheduleRoutes.js";
import courseRoutes from "./src/backend/routes/courseRoutes.js";
import userRoutes from "./src/backend/routes/userRoutes.js";
import studentRoutes from "./src/backend/routes/studentRoutes.js";
import gradeRoutes from "./src/backend/routes/gradeRoutes.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


const app = express();
app.use(cors());
app.use(express.json());

 

  app.use("/api/auth", authRoutes);

  app.use('/api/schedules', scheduleRoutes);

  app.use("/api/courses", courseRoutes); 

  app.use("/api/users", userRoutes);     

  app.use('/api/student', studentRoutes); 
  app.use('/api/grades', gradeRoutes); 

  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));