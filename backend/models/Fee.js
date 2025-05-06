const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const feeSchema = new mongoose.Schema({
  feeId: { type: String, default: uuidv4, unique: true }, 
  academicYear: { type: String, required: true },
  courseCode: { type: String, required: true },
  feeType: { type: String, required: true },
  category: { type: String, required: true },
  
  tuitionFees1: { type: Number, default: 0 },
  tuitionFees2: { type: Number, default: 0 },
  examFees: { type: Number, default: 0 },
  notebookFees: { type: Number, default: 0 },
  uniformFees: { type: Number, default: 0 },
  miscellaneousFees: { type: Number, default: 0 },
  otherFees: { type: Number, default: 0 },

  totalFees: { type: Number, default: 0 }, // This will be calculated before save

  dueDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});

// Pre-save hook to calculate totalFees
feeSchema.pre('save', function (next) {
  this.totalFees =
    this.tuitionFees1 +
    this.tuitionFees2 +
    this.examFees +
    this.notebookFees +
    this.uniformFees +
    this.miscellaneousFees +
    this.otherFees;
  next();
});

module.exports = mongoose.model('Fee', feeSchema);
