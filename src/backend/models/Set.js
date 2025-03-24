/**
* @type {mongoose.SchemaDefinitionProperty}
*/

import mongoose from "mongoose";

const setSchema = new mongoose.Schema({
  name: { type: String, required: true },
  schedules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Schedule" }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});