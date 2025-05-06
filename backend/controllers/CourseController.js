const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Create Course
router.post('/create_course', async (req, res) => {
  try {
    const { academicYear, courseCode, courseName } = req.body;
    const course = new Course({ academicYear, courseCode, courseName });
    const savedCourse = await course.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(400).json({ message: 'Failed to create course', error });
  }
});

// Get All Courses
router.get('/get_all_courses', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true });
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Failed to fetch courses', error });
  }
});

// Get Distinct Academic Years
router.get('/get_all_academic_years', async (req, res) => {
  try {
    const years = await Course.distinct('academicYear', { isActive: true });
    res.status(200).json(years);
  } catch (error) {
    console.error('Error fetching academic years:', error);
    res.status(500).json({ message: 'Failed to fetch academic years', error });
  }
});

// Get Distinct Course Names
router.get('/get_all_course_names', async (req, res) => {
  try {
    const names = await Course.distinct('courseName', { isActive: true });
    res.status(200).json(names);
  } catch (error) {
    console.error('Error fetching course names:', error);
    res.status(500).json({ message: 'Failed to fetch course names', error });
  }
});

// Get Distinct Course Codes
router.get('/get_all_course_codes', async (req, res) => {
  try {
    const codes = await Course.distinct('courseCode', { isActive: true });
    res.status(200).json(codes);
  } catch (error) {
    console.error('Error fetching course codes:', error);
    res.status(500).json({ message: 'Failed to fetch course codes', error });
  }
});

// Update Course
router.put('/update_course', async (req, res) => {
  try {
    const { courseId, academicYear, courseCode, courseName, isActive } = req.body;
    if (!courseId) return res.status(400).json({ message: 'courseId is required' });

    const updatedCourse = await Course.findOneAndUpdate(
      { courseId },
      { $set: { academicYear, courseCode, courseName, isActive } },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(400).json({ message: 'Failed to update course', error });
  }
});

// Delete Course
router.delete('/delete_course/:courseId', async (req, res) => {
  try {
    const deletedCourse = await Course.findOneAndDelete({ courseId: req.params.courseId });
    if (!deletedCourse) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Failed to delete course', error });
  }
});

module.exports = router;
