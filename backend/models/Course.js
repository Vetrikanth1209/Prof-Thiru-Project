const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const courseSchema = new mongoose.Schema({
  courseId: { type: String, default: uuidv4, unique: true }, // Unique UUID for Course
  academicYear: { type: String, required: true },
  courseCode: { type: String, required: true, unique: true },
  courseName: { type: String, required: true },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('Course', courseSchema);