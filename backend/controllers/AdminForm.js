const express = require('express');
const router = express.Router();
const Student = require('../models/AdminForm'); // or studentModel as appropriate
const upload = require('../middleware/multer');  // Import the multer middleware
const path = require('path'); // Add this import for path operations
const fs = require('fs'); // Add this import for file operations

// ✅ Create a new student with photo upload
router.post('/create_new_student', upload.single('studentPhoto'), async (req, res) => {
  try {
    // Process the file and form data
    const studentData = req.body;
    
    // If a file was uploaded, add the file path to the studentData
    if (req.file) {
      // Store path relative to server for database
      studentData.photoUrl = `/uploads/${req.file.filename}`;
    }
    
    const newStudent = new Student(studentData);
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(400).json({ message: 'Failed to create student', error: error.message });
  }
});

// Backend route: GET /get_all_student?page=1&limit=10
router.get('/get_all_student', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const students = await Student.find().skip(skip).limit(limit);
    const total = await Student.countDocuments(); // total students count
    
    res.status(200).json({ students, total });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Failed to fetch students', error });
  }
});
  
// 🔍 Get a student by student_id
router.get('/get_student_by_id/:id', async (req, res) => {
  try {
    const student = await Student.findOne({ student_id: req.params.id });
    
    if (!student) return res.status(404).json({ message: 'Student not found' });
    
    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Failed to fetch student', error });
  }
});
    
// 🔄 Update student by ID with photo upload capability
router.put('/update_student_by_id/:id', upload.single('studentPhoto'), async (req, res) => {
  try {
    const updateData = req.body;
    
    // If a new photo is uploaded, update the photoUrl
    if (req.file) {
      updateData.photoUrl = `/uploads/${req.file.filename}`;
      
      // Optionally: Delete the old photo file
      const existingStudent = await Student.findOne({ student_id: req.params.id });
      if (existingStudent && existingStudent.photoUrl) {
        const oldPhotoPath = path.join(__dirname, '..', 'public', existingStudent.photoUrl);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
    }
    
    const updatedStudent = await Student.findOneAndUpdate(
      { student_id: req.params.id },
      { $set: updateData },
      {
        new: true,         // 🔥 Return the updated document
        runValidators: true, // ✅ Optional: validate against schema
        upsert: false,       // ❌ Explicitly say DO NOT create new doc
      }
    );
    
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(400).json({ message: 'Failed to update student', error });
  }
});
   
// ❌ Delete student by student_id
router.delete('/delete_student_id/:id', async (req, res) => {
  try {
    // Find the student first to get the photo URL
    const studentToDelete = await Student.findOne({ student_id: req.params.id });
    
    if (!studentToDelete) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Delete the student's photo if it exists
    if (studentToDelete.photoUrl) {
      const photoPath = path.join(__dirname, '..', 'public', studentToDelete.photoUrl);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }
    
    // Delete the student from the database
    await Student.findOneAndDelete({ student_id: req.params.id });
    
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Failed to delete student', error });
  }
});
        
module.exports = router;