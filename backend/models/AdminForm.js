const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const studentSchema = new mongoose.Schema({
    applicationNo: { type: String, default:uuidv4 },
    admissionNo: { type: String, default: uuidv4 },
    dateOfAdmission: { type: String },
    rollNumber: { type: String },
    student_id: { type: String }, // 🎯 Auto UUID
    name: { type: String },
    contactNo: { type: String, },
    gender: { type: String },
    nationality: { type: String },
    aadharNo: { type: String },
    dateOfBirth: { type: Date },
    caste: { type: String },
    religion: { type: String },
    community: { type: String },
    communalCategory: {
      type: String,
      enum: ['GEN', 'BC', 'BCM', 'MBC', 'DNC', 'SC', 'ST']
    },

    fatherName: { type: String },
    fatherContactNo: { type: String },
    fatherOccupation: { type: String },
    fatherAadharNo: { type: String },

    motherName: { type: String },
    motherContactNo: { type: String },
    motherOccupation: { type: String },
    motherAadharNo: { type: String },

    guardianName: { type: String, default: null },
    guardianContactNo: { type: String, default: null },
    guardianOccupation: { type: String, default: null },
    guardianAadharNo: { type: String, default: null },

    permanentAddressLine1: { type: String },
    permanentAddressLine2: { type: String },
    permanentTaluk: { type: String },
    permanentDistrict: { type: String },
    permanentState: { type: String },
    permanentPinCode: { type: String },

    communicationAddressLine1: { type: String },
    communicationAddressLine2: { type: String },
    communicationTaluk: { type: String },
    communicationDistrict: { type: String },
    communicationState: { type: String },
    communicationPinCode: { type: String },

    lastSchoolAttended: { type: String },
    lastClassCompleted: {
      type: String,
    },
    yearOfPassing: { type: String },
    emisNumberOrTC: { type: String },

    courseSelected: { type: [String] },
    mediumOfInstruction: { type: String },
    hostelDayScholarOrBus: {
      type: String
    },
    extraCurricularActivity: { type: String },

    physicallyChallenged: { type: Boolean, default: false },
    exServiceManChild: { type: Boolean, default: false },
    belongsToAndamanNicobar: { type: Boolean, default: false }
  
});

module.exports = mongoose.model('Student', studentSchema);
