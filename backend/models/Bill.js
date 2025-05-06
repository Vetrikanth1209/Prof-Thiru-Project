const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const billSchema = new mongoose.Schema({
  billId: { type: String, default: uuidv4, unique: true }, // Unique UUID for Bill
  academicYear: { type: String, required: true },
  department: { type: String, required: true },
  rollNo: { type: String, required: true },
  name: { type: String, required: true },
  feesDetails: {
    oldFees: { type: Number, required: true },
    newFees: { type: Number, required: true },
  },
  discount: { type: Number, default: 0 },
  fine: { type: Number, default: 0 }
});

module.exports = mongoose.model('Bill', billSchema);