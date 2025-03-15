/* eslint-disable no-undef */
import express from 'express';
import dotenv from  'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from "./src/backend/routes/authRoutes.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


const app = express();
app.use(cors());
app.use(express.json());

 

  app.use("/api/auth", authRoutes);


  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));