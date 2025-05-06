const express = require('express');
const router = express.Router();
const Student = require('../models/AdminForm'); // or studentModel — choose the correct one

// ✅ Create a new student
router.post('/create_new_student', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(400).json({ message: 'Failed to create student', error });
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

  

router.put('/update_student_by_id/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { student_id: req.params.id },
      { $set: req.body },
      {
        new: true,          // 🔥 Return the updated document
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
    const deletedStudent = await Student.findOneAndDelete({ student_id: req.params.id });

    if (!deletedStudent) return res.status(404).json({ message: 'Student not found' });

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Failed to delete student', error });
  }
});

  
  
  module.exports = router;