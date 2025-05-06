import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Paper, Typography, Accordion, AccordionSummary, AccordionDetails,
  Grid, TextField, MenuItem, FormControl, Select, InputLabel, Button, Box,
  Avatar, CircularProgress, Snackbar, Alert, LinearProgress, FormHelperText,
  Checkbox, FormControlLabel, Divider
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, PhotoCamera, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

const steps = [
  'Student Details',
  'Parent/Guardian Info',
  'Address Details',
  'Educational Background',
  'Course Selection'
];

const validationSchemas = [
  Yup.object({
    studentPhoto: Yup.mixed()
      .test('fileSize', 'File too large, maximum size is 1MB', (value) => !value || value.size <= 1024 * 1024)
      .test('fileFormat', 'Unsupported format, please upload an image', (value) => !value || value.type.startsWith('image/')),
    name: Yup.string(),
    contactNo: Yup.string().matches(/^[0-9]{10}$/, 'Must be a valid 10-digit phone number'),
    gender: Yup.string().oneOf(['Male', 'Female', 'Other'], 'Invalid Gender'),
    nationality: Yup.string(),
    aadharNo: Yup.string().matches(/^[0-9]{12}$/, 'Must be a valid 12-digit Aadhar number'),
    dateOfBirth: Yup.date().nullable(),
    caste: Yup.string(),
    religion: Yup.string(),
    community: Yup.string(),
    communalCategory: Yup.string().oneOf(['GEN', 'BC', 'BCM', 'MBC', 'DNC', 'SC', 'ST'], 'Invalid Category')
  }),
  Yup.object({
    fatherName: Yup.string(),
    fatherContactNo: Yup.string().matches(/^[0-9]{10}$/, 'Must be a valid 10-digit phone number'),
    fatherOccupation: Yup.string(),
    fatherAadharNo: Yup.string().matches(/^[0-9]{12}$/, 'Must be a valid 12-digit Aadhar number'),
    motherName: Yup.string(),
    motherContactNo: Yup.string().matches(/^[0-9]{10}$/, 'Must be a valid 10-digit phone number'),
    motherOccupation: Yup.string(),
    motherAadharNo: Yup.string().matches(/^[0-9]{12}$/, 'Must be a valid 12-digit Aadhar number'),
    guardianName: Yup.string(),
    guardianContactNo: Yup.string().matches(/^[0-9]{10}$/, 'Must be a valid 10-digit phone number'),
    guardianOccupation: Yup.string(),
    guardianAadharNo: Yup.string().matches(/^[0-9]{12}$/, 'Must be a valid 12-digit Aadhar number')
  }),
  Yup.object({
    permanentAddressLine1: Yup.string(),
    permanentAddressLine2: Yup.string(),
    permanentTaluk: Yup.string(),
    permanentDistrict: Yup.string(),
    permanentState: Yup.string(),
    permanentPinCode: Yup.string().matches(/^[0-9]{6}$/, 'Must be a valid 6-digit PIN code'),
    communicationAddressLine1: Yup.string(),
    communicationAddressLine2: Yup.string(),
    communicationTaluk: Yup.string(),
    communicationDistrict: Yup.string(),
    communicationState: Yup.string(),
    communicationPinCode: Yup.string().matches(/^[0-9]{6}$/, 'Must be a valid 6-digit PIN code')
  }),
  Yup.object({
    lastSchoolAttended: Yup.string(),
    lastClassCompleted: Yup.string().oneOf(['ITI', '10th', '12th'], 'Invalid Class'),
    yearOfPassing: Yup.string().matches(/^[0-9]{4}$/, 'Must be a valid year'),
    emisNumberOrTC: Yup.string()
  }),
  Yup.object({
    courseSelected: Yup.array(),
    mediumOfInstruction: Yup.string(),
    hostelDayScholarOrBus: Yup.string().oneOf(['Hostel', 'Day Scholar', 'College Bus'], 'Invalid Option'),
    extraCurricularActivity: Yup.string(),
    physicallyChallenged: Yup.boolean(),
    exServiceManChild: Yup.boolean(),
    belongsToAndamanNicobar: Yup.boolean(),
    dateOfAdmission: Yup.date().nullable(),
    rollNumber: Yup.string()
  })
];

const initialValues = {
  studentPhoto: null,
  name: '',
  contactNo: '',
  gender: '',
  nationality: '',
  aadharNo: '',
  dateOfBirth: null,
  caste: '',
  religion: '',
  community: '',
  communalCategory: '',
  fatherName: '',
  fatherContactNo: '',
  fatherOccupation: '',
  fatherAadharNo: '',
  motherName: '',
  motherContactNo: '',
  motherOccupation: '',
  motherAadharNo: '',
  guardianName: '',
  guardianContactNo: '',
  guardianOccupation: '',
  guardianAadharNo: '',
  permanentAddressLine1: '',
  permanentAddressLine2: '',
  permanentTaluk: '',
  permanentDistrict: '',
  permanentState: '',
  permanentPinCode: '',
  communicationAddressLine1: '',
  communicationAddressLine2: '',
  communicationTaluk: '',
  communicationDistrict: '',
  communicationState: '',
  communicationPinCode: '',
  lastSchoolAttended: '',
  lastClassCompleted: '',
  yearOfPassing: '',
  emisNumberOrTC: '',
  courseSelected: [],
  mediumOfInstruction: '',
  hostelDayScholarOrBus: '',
  extraCurricularActivity: '',
  dateOfAdmission: null,
  rollNumber: '',
  physicallyChallenged: false,
  exServiceManChild: false,
  belongsToAndamanNicobar: false
};

const genderOptions = ['Male', 'Female', 'Other'];
const communalCategories = ['GEN', 'BC', 'BCM', 'MBC', 'DNC', 'SC', 'ST'];
const classOptions = ['ITI', '10th', '12th'];
const courseOptions = ['Computer Science', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering'];
const mediumOptions = ['English', 'Tamil', 'Hindi'];
const hostelOptions = ['Hostel', 'Day Scholar', 'College Bus'];

const AdmissionForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [expanded, setExpanded] = useState(steps[0]);
  const [studentId, setStudentId] = useState(() => sessionStorage.getItem('student_id') || '');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (completed) {
        sessionStorage.removeItem('student_id');
        sessionStorage.removeItem('fee_id');
      }
    };
  }, [completed]);

  const generateStudentId = () => `STU-${Date.now()}`;

  const showAlert = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleNext = async (values, actions, currentStep) => {
    setLoading(true);
    const schema = validationSchemas[currentStep];

    try {
      await schema.validate(values, { abortEarly: false });

      let student_id = studentId;

      if (currentStep === 0) {
        student_id = generateStudentId();
        const formData = new FormData();
        if (values.studentPhoto) {
          formData.append('studentPhoto', values.studentPhoto);
        }
        const payload = { ...values, student_id };
        delete payload.studentPhoto;
        if (payload.courseSelected) {
          payload.courseSelected = Array.isArray(payload.courseSelected) ? payload.courseSelected : [payload.courseSelected];
        }
        if (payload.dateOfBirth) {
          payload.dateOfBirth = dayjs(payload.dateOfBirth).toISOString();
        }
        if (payload.dateOfAdmission) {
          payload.dateOfAdmission = dayjs(payload.dateOfAdmission).toISOString();
        }
        for (const key in payload) {
          formData.append(key, typeof payload[key] === 'object' ? JSON.stringify(payload[key]) : payload[key]);
        }

        const response = await axios.post(
          'http://localhost:8000/admission/create_new_student',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        console.log('Create student response:', response.data);

        sessionStorage.setItem('student_id', student_id);
        setStudentId(student_id);
        showAlert('Student details saved successfully');
      } else {
        if (!student_id) {
          throw new Error('No student ID found');
        }

        const payload = { ...values };
        delete payload.studentPhoto;
        if (payload.courseSelected) {
          payload.courseSelected = Array.isArray(payload.courseSelected) ? payload.courseSelected : [payload.courseSelected];
        }
        if (payload.dateOfBirth) {
          payload.dateOfBirth = dayjs(payload.dateOfBirth).toISOString();
        }
        if (payload.dateOfAdmission) {
          payload.dateOfAdmission = dayjs(payload.dateOfAdmission).toISOString();
        }

        if (currentStep === 0 && values.studentPhoto instanceof File) {
          const formData = new FormData();
          formData.append('studentPhoto', values.studentPhoto);
          for (const key in payload) {
            formData.append(key, typeof payload[key] === 'object' ? JSON.stringify(payload[key]) : payload[key]);
          }
          const response = await axios.put(
            `http://localhost:8000/admission/update_student_by_id/${student_id}`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
          console.log('Update student (photo) response:', response.data);
        } else {
          const response = await axios.put(
            `http://localhost:8000/admission/update_student_by_id/${student_id}`,
            payload
          );
          console.log('Update student response:', response.data);
        }

        showAlert(`Step ${currentStep + 1} completed successfully`);
      }

      if (currentStep === validationSchemas.length - 1) {
        const feePayload = {
          student_id,
          discount: 10,
          pendingFees: 12000,
          paidAmount: 0,
          dueDate: new Date('2025-05-15').toISOString()
        };
        const feeRes = await axios.post('http://localhost:8000/studentFee/create', feePayload);
        console.log('Fee creation response:', feeRes.data);
        const feeId = feeRes.data.studentFeeId || feeRes.data._id;
        sessionStorage.setItem('fee_id', feeId);
        showAlert('Fee record created successfully');
      }

      setActiveStep((prev) => prev + 1);
      setExpanded(steps[Math.min(currentStep + 1, steps.length - 1)]);
      actions.setTouched({});
      actions.setSubmitting(false);
    } catch (err) {
      if (err.name === 'ValidationError') {
        const fieldErrors = {};
        err.inner.forEach((e) => {
          fieldErrors[e.path] = e.message;
        });
        actions.setErrors(fieldErrors);
        showAlert('Please correct the highlighted fields', 'error');
      } else {
        console.error('Backend error:', err.response?.data?.message || err.message);
        showAlert(
          `Error: ${err.response?.data?.message || 'Failed to save data. Try again.'}`,
          'error'
        );
      }
    } finally {
      setLoading(false);
      actions.setSubmitting(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setExpanded(steps[Math.max(activeStep - 1, 0)]);
  };

  const handleSubmit = async (values, actions) => {
    if (activeStep < steps.length - 1) {
      handleNext(values, actions, activeStep);
      return;
    }

    setLoading(true);
    const student_id = studentId || sessionStorage.getItem('student_id');

    if (!student_id) {
      console.error('handleSubmit: No student ID found');
      showAlert('No student ID found. Please restart the form.', 'error');
      setLoading(false);
      actions.setSubmitting(false);
      return;
    }

    try {
      const feeId = sessionStorage.getItem('fee_id');
      if (!feeId) {
        console.error('handleSubmit: No fee ID found');
        throw new Error('Fee record not found. Please try again.');
      }

      setCompleted(true);
      showAlert('Form submitted successfully!', 'success');
      setTimeout(() => navigate('/table'), 1000);
    } catch (err) {
      console.error('handleSubmit error:', err.response?.data || err.message);
      showAlert(
        `Failed to submit the form: ${err.response?.data?.message || err.message}`,
        'error'
      );
    } finally {
      setLoading(false);
      actions.setSubmitting(false);
    }
  };

  const calculateProgress = (errors) => {
    const totalFields = Object.keys(initialValues).length;
    const errorFields = Object.keys(errors).length;
    return ((totalFields - errorFields) / totalFields) * 100;
  };

  const PhotoUpload = ({ setFieldValue, touched, errors }) => {
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleDrop = (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        setFieldValue('studentPhoto', file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      }
    };

    const handleChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFieldValue('studentPhoto', file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      }
    };

    return (
      <Box
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        sx={{ border: '2px dashed #ccc', p: 2, textAlign: 'center', mb: 2, '&:hover': { borderColor: '#1976d2' } }}
      >
        <Avatar src={preview} sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }} />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleChange}
          id="student-photo-upload"
        />
        <Button
          variant="contained"
          startIcon={<PhotoCamera />}
          onClick={() => fileInputRef.current.click()}
        >
          Upload Photo
        </Button>
        <Typography variant="caption" color="textSecondary" display="block" mt={1}>
          Drag and drop or click to upload (Max: 1MB)
        </Typography>
        {touched.studentPhoto && errors.studentPhoto && (
          <FormHelperText error>{errors.studentPhoto}</FormHelperText>
        )}
      </Box>
    );
  };

  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
          <Typography variant="h4" align="center" gutterBottom color="primary.main">
            Admission Form
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchemas[activeStep]}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, setFieldValue, isSubmitting, setErrors, setTouched, setSubmitting }) => (
              <Form>
                <LinearProgress
                  variant="determinate"
                  value={calculateProgress(errors)}
                  sx={{ mb: 3 }}
                />
                {steps.map((step, index) => (
                  <Accordion
                    key={step}
                    expanded={expanded === step}
                    onChange={() => setExpanded(expanded === step ? false : step)}
                    disabled={index > activeStep}
                    sx={{ mb: 2 }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">{step}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {index === 0 && (
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <PhotoUpload setFieldValue={setFieldValue} touched={touched} errors={errors} />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="name"
                              label="Name"
                              fullWidth
                              error={touched.name && !!errors.name}
                              helperText={touched.name && errors.name}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="contactNo"
                              label="Contact Number"
                              fullWidth
                              error={touched.contactNo && !!errors.contactNo}
                              helperText={touched.contactNo && errors.contactNo}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={touched.gender && !!errors.gender}>
                              <InputLabel>Gender</InputLabel>
                              <Field as={Select} name="gender" label="Gender">
                                {genderOptions.map((option) => (
                                  <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                              </Field>
                              {touched.gender && errors.gender && (
                                <FormHelperText>{errors.gender}</FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="nationality"
                              label="Nationality"
                              fullWidth
                              error={touched.nationality && !!errors.nationality}
                              helperText={touched.nationality && errors.nationality}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="aadharNo"
                              label="Aadhar Number"
                              fullWidth
                              error={touched.aadharNo && !!errors.aadharNo}
                              helperText={touched.aadharNo && errors.aadharNo}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              name="dateOfBirth"
                              render={({ field }) => (
                                <DatePicker
                                  label="Date of Birth"
                                  value={field.value ? dayjs(field.value) : null}
                                  onChange={(date) => setFieldValue('dateOfBirth', date)}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      error={touched.dateOfBirth && !!errors.dateOfBirth}
                                      helperText={touched.dateOfBirth && errors.dateOfBirth}
                                    />
                                  )}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="caste"
                              label="Caste"
                              fullWidth
                              error={touched.caste && !!errors.caste}
                              helperText={touched.caste && errors.caste}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="religion"
                              label="Religion"
                              fullWidth
                              error={touched.religion && !!errors.religion}
                              helperText={touched.religion && errors.religion}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="community"
                              label="Community"
                              fullWidth
                              error={touched.community && !!errors.community}
                              helperText={touched.community && errors.community}
                            />
                          </Grid>
                          
                            <FormControl fullWidth error={touched.communalCategory && !!errors.communalCategory}>
                              <InputLabel>Communal Category</InputLabel>
                              <Field as={Select} name="communalCategory" label="Communal Category">
                                {communalCategories.map((option) => (
                                  <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                              </Field>
                              {touched.communalCategory && errors.communalCategory && (
                                <FormHelperText>{errors.communalCategory}</FormHelperText>
                              )}
                            </FormControl>
                         
                        </Grid>
                      )}
                      {index === 1 && (
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="fatherName"
                              label="Father's Name"
                              fullWidth
                              error={touched.fatherName && !!errors.fatherName}
                              helperText={touched.fatherName && errors.fatherName}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="fatherContactNo"
                              label="Father's Contact Number"
                              fullWidth
                              error={touched.fatherContactNo && !!errors.fatherContactNo}
                              helperText={touched.fatherContactNo && errors.fatherContactNo}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="fatherOccupation"
                              label="Father's Occupation"
                              fullWidth
                              error={touched.fatherOccupation && !!errors.fatherOccupation}
                              helperText={touched.fatherOccupation && errors.fatherOccupation}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="fatherAadharNo"
                              label="Father's Aadhar Number"
                              fullWidth
                              error={touched.fatherAadharNo && !!errors.fatherAadharNo}
                              helperText={touched.fatherAadharNo && errors.fatherAadharNo}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="motherName"
                              label="Mother's Name"
                              fullWidth
                              error={touched.motherName && !!errors.motherName}
                              helperText={touched.motherName && errors.motherName}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="motherContactNo"
                              label="Mother's Contact Number"
                              fullWidth
                              error={touched.motherContactNo && !!errors.motherContactNo}
                              helperText={touched.motherContactNo && errors.motherContactNo}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="motherOccupation"
                              label="Mother's Occupation"
                              fullWidth
                              error={touched.motherOccupation && !!errors.motherOccupation}
                              helperText={touched.motherOccupation && errors.motherOccupation}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="motherAadharNo"
                              label="Mother's Aadhar Number"
                              fullWidth
                              error={touched.motherAadharNo && !!errors.motherAadharNo}
                              helperText={touched.motherAadharNo && errors.motherAadharNo}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="guardianName"
                              label="Guardian's Name"
                              fullWidth
                              error={touched.guardianName && !!errors.guardianName}
                              helperText={touched.guardianName && errors.guardianName}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="guardianContactNo"
                              label="Guardian's Contact Number"
                              fullWidth
                              error={touched.guardianContactNo && !!errors.guardianContactNo}
                              helperText={touched.guardianContactNo && errors.guardianContactNo}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="guardianOccupation"
                              label="Guardian's Occupation"
                              fullWidth
                              error={touched.guardianOccupation && !!errors.guardianOccupation}
                              helperText={touched.guardianOccupation && errors.guardianOccupation}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="guardianAadharNo"
                              label="Guardian's Aadhar Number"
                              fullWidth
                              error={touched.guardianAadharNo && !!errors.guardianAadharNo}
                              helperText={touched.guardianAadharNo && errors.guardianAadharNo}
                            />
                          </Grid>
                        </Grid>
                      )}
                      {index === 2 && (
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>Permanent Address</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="permanentAddressLine1"
                              label="Address Line 1"
                              fullWidth
                              error={touched.permanentAddressLine1 && !!errors.permanentAddressLine1}
                              helperText={touched.permanentAddressLine1 && errors.permanentAddressLine1}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="permanentAddressLine2"
                              label="Address Line 2"
                              fullWidth
                              error={touched.permanentAddressLine2 && !!errors.permanentAddressLine2}
                              helperText={touched.permanentAddressLine2 && errors.permanentAddressLine2}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="permanentTaluk"
                              label="Taluk"
                              fullWidth
                              error={touched.permanentTaluk && !!errors.permanentTaluk}
                              helperText={touched.permanentTaluk && errors.permanentTaluk}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="permanentDistrict"
                              label="District"
                              fullWidth
                              error={touched.permanentDistrict && !!errors.permanentDistrict}
                              helperText={touched.permanentDistrict && errors.permanentDistrict}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="permanentState"
                              label="State"
                              fullWidth
                              error={touched.permanentState && !!errors.permanentState}
                              helperText={touched.permanentState && errors.permanentState}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="permanentPinCode"
                              label="PIN Code"
                              fullWidth
                              error={touched.permanentPinCode && !!errors.permanentPinCode}
                              helperText={touched.permanentPinCode && errors.permanentPinCode}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>Communication Address</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="communicationAddressLine1"
                              label="Address Line 1"
                              fullWidth
                              error={touched.communicationAddressLine1 && !!errors.communicationAddressLine1}
                              helperText={touched.communicationAddressLine1 && errors.communicationAddressLine1}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="communicationAddressLine2"
                              label="Address Line 2"
                              fullWidth
                              error={touched.communicationAddressLine2 && !!errors.communicationAddressLine2}
                              helperText={touched.communicationAddressLine2 && errors.communicationAddressLine2}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="communicationTaluk"
                              label="Taluk"
                              fullWidth
                              error={touched.communicationTaluk && !!errors.communicationTaluk}
                              helperText={touched.communicationTaluk && errors.communicationTaluk}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="communicationDistrict"
                              label="District"
                              fullWidth
                              error={touched.communicationDistrict && !!errors.communicationDistrict}
                              helperText={touched.communicationDistrict && errors.communicationDistrict}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="communicationState"
                              label="State"
                              fullWidth
                              error={touched.communicationState && !!errors.communicationState}
                              helperText={touched.communicationState && errors.communicationState}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="communicationPinCode"
                              label="PIN Code"
                              fullWidth
                              error={touched.communicationPinCode && !!errors.communicationPinCode}
                              helperText={touched.communicationPinCode && errors.communicationPinCode}
                            />
                          </Grid>
                        </Grid>
                      )}
                      {index === 3 && (
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="lastSchoolAttended"
                              label="Last School Attended"
                              fullWidth
                              error={touched.lastSchoolAttended && !!errors.lastSchoolAttended}
                              helperText={touched.lastSchoolAttended && errors.lastSchoolAttended}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={touched.lastClassCompleted && !!errors.lastClassCompleted}>
                              <InputLabel>Last Class Completed</InputLabel>
                              <Field as={Select} name="lastClassCompleted" label="Last Class Completed">
                                {classOptions.map((option) => (
                                  <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                              </Field>
                              {touched.lastClassCompleted && errors.lastClassCompleted && (
                                <FormHelperText>{errors.lastClassCompleted}</FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="yearOfPassing"
                              label="Year of Passing"
                              fullWidth
                              error={touched.yearOfPassing && !!errors.yearOfPassing}
                              helperText={touched.yearOfPassing && errors.yearOfPassing}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="emisNumberOrTC"
                              label="EMIS Number or TC"
                              fullWidth
                              error={touched.emisNumberOrTC && !!errors.emisNumberOrTC}
                              helperText={touched.emisNumberOrTC && errors.emisNumberOrTC}
                            />
                          </Grid>
                        </Grid>
                      )}
                      {index === 4 && (
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <FormControl fullWidth error={touched.courseSelected && !!errors.courseSelected}>
                              <InputLabel>Courses Selected</InputLabel>
                              <Field
                                as={Select}
                                name="courseSelected"
                                label="Courses Selected"
                                multiple
                                value={values.courseSelected}
                                onChange={(e) => setFieldValue('courseSelected', e.target.value)}
                              >
                                {courseOptions.map((option) => (
                                  <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                              </Field>
                              {touched.courseSelected && errors.courseSelected && (
                                <FormHelperText>{errors.courseSelected}</FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={touched.mediumOfInstruction && !!errors.mediumOfInstruction}>
                              <InputLabel>Medium of Instruction</InputLabel>
                              <Field as={Select} name="mediumOfInstruction" label="Medium of Instruction">
                                {mediumOptions.map((option) => (
                                  <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                              </Field>
                              {touched.mediumOfInstruction && errors.mediumOfInstruction && (
                                <FormHelperText>{errors.mediumOfInstruction}</FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={touched.hostelDayScholarOrBus && !!errors.hostelDayScholarOrBus}>
                              <InputLabel>Hostel/Day Scholar/Bus</InputLabel>
                              <Field as={Select} name="hostelDayScholarOrBus" label="Hostel/Day Scholar/Bus">
                                {hostelOptions.map((option) => (
                                  <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                              </Field>
                              {touched.hostelDayScholarOrBus && errors.hostelDayScholarOrBus && (
                                <FormHelperText>{errors.hostelDayScholarOrBus}</FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12}>
                            <Field
                              as={TextField}
                              name="extraCurricularActivity"
                              label="Extra-Curricular Activity"
                              fullWidth
                              error={touched.extraCurricularActivity && !!errors.extraCurricularActivity}
                              helperText={touched.extraCurricularActivity && errors.extraCurricularActivity}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              name="dateOfAdmission"
                              render={({ field }) => (
                                <DatePicker
                                  label="Date of Admission"
                                  value={field.value ? dayjs(field.value) : null}
                                  onChange={(date) => setFieldValue('dateOfAdmission', date)}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      error={touched.dateOfAdmission && !!errors.dateOfAdmission}
                                      helperText={touched.dateOfAdmission && errors.dateOfAdmission}
                                    />
                                  )}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Field
                              as={TextField}
                              name="rollNumber"
                              label="Roll Number"
                              fullWidth
                              error={touched.rollNumber && !!errors.rollNumber}
                              helperText={touched.rollNumber && errors.rollNumber}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Field
                              name="physicallyChallenged"
                              render={({ field }) => (
                                <FormControlLabel
                                  control={<Checkbox {...field} checked={field.value} />}
                                  label="Physically Challenged"
                                />
                              )}
                            />
                            <Field
                              name="exServiceManChild"
                              render={({ field }) => (
                                <FormControlLabel
                                  control={<Checkbox {...field} checked={field.value} />}
                                  label="Child of Ex-Serviceman"
                                />
                              )}
                            />
                            <Field
                              name="belongsToAndamanNicobar"
                              render={({ field }) => (
                                <FormControlLabel
                                  control={<Checkbox {...field} checked={field.value} />}
                                  label="Belongs to Andaman & Nicobar"
                                />
                              )}
                            />
                          </Grid>
                        </Grid>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
                {activeStep === steps.length && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                    <Typography variant="h4" gutterBottom>
                      Admission Complete!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      Student ID: {studentId}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      All information has been successfully submitted. You will be redirected to the student table.
                    </Typography>
                    </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                  {activeStep > 0 && activeStep < steps.length && (
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      disabled={loading || isSubmitting}
                      fullWidth={window.innerWidth < 600}
                      sx={{ minWidth: { sm: 120 } }}
                    >
                      Back
                    </Button>
                  )}
                  {activeStep < steps.length && (
                    <Button
                      variant="contained"
                      onClick={() => handleNext(values, { setErrors, setTouched, setSubmitting }, activeStep)}
                      disabled={loading || isSubmitting}
                      fullWidth={window.innerWidth < 600}
                      sx={{ minWidth: { sm: 120 } }}
                    >
                      {loading ? <CircularProgress size={24} /> : activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                    </Button>
                  )}
                  {activeStep === steps.length && (
                    <Button
                      variant="contained"
                      onClick={() => navigate('/table')}
                      fullWidth={window.innerWidth < 600}
                      sx={{ minWidth: { sm: 120 } }}
                    >
                      Go to Student Table
                    </Button>
                  )}
                </Box>
              </Form>
            )}
          </Formik>
          <Snackbar
            open={alert.open}
            autoHideDuration={6000}
            onClose={handleCloseAlert}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
              {alert.message}
            </Alert>
          </Snackbar>
        </Paper>
      </Container>
    </LocalizationProvider>
    </>
  );
};


export default AdmissionForm;