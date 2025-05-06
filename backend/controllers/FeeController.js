const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');

// Create Fee
router.post('/create_fee', async (req, res) => {
  try {
    const {
      academicYear,
      courseCode,
      feeType,
      category,
      tuitionFees1,
      tuitionFees2,
      examFees,
      notebookFees,
      uniformFees,
      miscellaneousFees,
      otherFees,
      dueDate
    } = req.body;

    const fee = new Fee({
      academicYear,
      courseCode,
      feeType,
      category,
      tuitionFees1,
      tuitionFees2,
      examFees,
      notebookFees,
      uniformFees,
      miscellaneousFees,
      otherFees,
      dueDate
    });

    const savedFee = await fee.save();
    res.status(201).json(savedFee);
  } catch (error) {
    console.error('Error creating fee:', error);
    res.status(400).json({ message: 'Failed to create fee', error });
  }
});

// Get All Active Fees
router.get('/get_all_fees', async (req, res) => {
  try {
    const fees = await Fee.find({ isActive: true });
    res.status(200).json(fees);
  } catch (error) {
    console.error('Error fetching fees:', error);
    res.status(500).json({ message: 'Failed to fetch fees', error });
  }
});

// Get Fee by Fee ID
router.get('/get_fee/:feeId', async (req, res) => {
  try {
    const fee = await Fee.findOne({ feeId: req.params.feeId });
    if (!fee) return res.status(404).json({ message: 'Fee not found' });
    res.status(200).json(fee);
  } catch (error) {
    console.error('Error fetching fee by ID:', error);
    res.status(500).json({ message: 'Failed to fetch fee', error });
  }
});


// Get Fees by Academic Year, Course Code, and Category (Modified to POST)
router.post('/get_fees_by_criteria', async (req, res) => {
  try {
    const { academicYear, courseCode, category } = req.body;

    if (!academicYear || !courseCode || !category) {
      return res.status(400).json({ message: 'academicYear, courseCode, and category are required' });
    }

    const fees = await Fee.find({
      academicYear,
      courseCode,
      category,
      isActive: true
    });

    if (fees.length === 0) {
      return res.status(404).json({ message: 'No fees found for the specified criteria' });
    }

    res.status(200).json(fees);
  } catch (error) {
    console.error('Error fetching fees by criteria:', error);
    res.status(500).json({ message: 'Failed to fetch fees', error });
  }
});

// Update Fee
router.put('/update_fee', async (req, res) => {
  try {
    const {
      feeId,
      academicYear,
      courseCode,
      feeType,
      category,
      tuitionFees1,
      tuitionFees2,
      examFees,
      notebookFees,
      uniformFees,
      miscellaneousFees,
      otherFees,
      dueDate,
      isActive
    } = req.body;

    if (!feeId) return res.status(400).json({ message: 'feeId is required' });

    const fee = await Fee.findOne({ feeId });
    if (!fee) return res.status(404).json({ message: 'Fee not found' });

    // Update fields
    fee.academicYear = academicYear;
    fee.courseCode = courseCode;
    fee.feeType = feeType;
    fee.category = category;
    fee.tuitionFees1 = tuitionFees1;
    fee.tuitionFees2 = tuitionFees2;
    fee.examFees = examFees;
    fee.notebookFees = notebookFees;
    fee.uniformFees = uniformFees;
    fee.miscellaneousFees = miscellaneousFees;
    fee.otherFees = otherFees;
    fee.dueDate = dueDate;
    fee.isActive = isActive;

    const updatedFee = await fee.save(); // triggers pre-save hook to recalculate totalFees
    res.status(200).json(updatedFee);
  } catch (error) {
    console.error('Error updating fee:', error);
    res.status(400).json({ message: 'Failed to update fee', error });
  }
});

// Delete Fee
router.delete('/delete_fee/:feeId', async (req, res) => {
  try {
    const deletedFee = await Fee.findOneAndDelete({ feeId: req.params.feeId });
    if (!deletedFee) return res.status(404).json({ message: 'Fee not found' });
    res.status(200).json({ message: 'Fee deleted successfully' });
  } catch (error) {
    console.error('Error deleting fee:', error);
    res.status(500).json({ message: 'Failed to delete fee', error });
  }
});

module.exports = router;
