const express = require('express');
const Bill = require('../models/Bill');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Middleware to validate UUID format
const validateUUID = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Create a new bill
router.post('/create_new_bill', async (req, res) => {
  try {
    const { academicYear, department, rollNo, name, feesDetails, discount, fine } = req.body;

    // Validate required fields
    if (
      !academicYear ||
      !department ||
      !rollNo ||
      !name ||
      !feesDetails ||
      feesDetails.oldFees == null ||
      feesDetails.newFees == null
    ) {
      return res.status(400).json({ error: 'All required fields (academicYear, department, rollNo, name, feesDetails.oldFees, feesDetails.newFees) must be provided' });
    }

    const bill = new Bill({
      billId: uuidv4(),
      academicYear,
      department,
      rollNo,
      name,
      feesDetails,
      discount: discount || 0,
      fine: fine || 0,
    });

    await bill.save();
    res.status(201).json(bill);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Bill with this rollNo or billId already exists' });
    }
    res.status(500).json({ error: 'Failed to create bill', details: error.message });
  }
});

// Get all bills with pagination
router.get('/get_all_bills', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const bills = await Bill.find().skip(skip).limit(limit);
    const total = await Bill.countDocuments();

    res.status(200).json({ bills, total, page, limit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bills', details: error.message });
  }
});

// Get a bill by billId
router.get('/get_bill_by_id/:billId', async (req, res) => {
  try {
    const { billId } = req.params;

    if (!validateUUID(billId)) {
      return res.status(400).json({ error: 'Invalid billId format' });
    }

    const bill = await Bill.findOne({ billId });
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.status(200).json(bill);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bill', details: error.message });
  }
});

// Update a bill
router.put('/update_bill_by_id', async (req, res) => {
  try {
    const { billId, academicYear, department, rollNo, name, feesDetails, discount, fine } = req.body;

    if (!billId) {
      return res.status(400).json({ error: 'billId is required' });
    }

    if (!validateUUID(billId)) {
      return res.status(400).json({ error: 'Invalid billId format' });
    }

    // Validate required fields for update
    if (
      academicYear !== undefined && !academicYear ||
      department !== undefined && !department ||
      rollNo !== undefined && !rollNo ||
      name !== undefined && !name ||
      feesDetails &&
      (feesDetails.oldFees == null || feesDetails.newFees == null)
    ) {
      return res.status(400).json({ error: 'Required fields cannot be empty' });
    }

    const updates = {
      ...(academicYear && { academicYear }),
      ...(department && { department }),
      ...(rollNo && { rollNo }),
      ...(name && { name }),
      ...(feesDetails && { feesDetails }),
      ...(discount !== undefined && { discount }),
      ...(fine !== undefined && { fine }),
    };

    const bill = await Bill.findOneAndUpdate(
      { billId },
      updates,
      { new: true, runValidators: true }
    );

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.status(200).json(bill);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'RollNo already exists' });
    }
    res.status(500).json({ error: 'Failed to update bill', details: error.message });
  }
});

// Delete a bill by billId
router.delete('/delete_bill_by_id/:billId', async (req, res) => {
  try {
    const { billId } = req.params;

    if (!validateUUID(billId)) {
      return res.status(400).json({ error: 'Invalid billId format' });
    }

    const bill = await Bill.findOneAndDelete({ billId });
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.status(200).json({ message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bill', details: error.message });
  }
});

module.exports = router;