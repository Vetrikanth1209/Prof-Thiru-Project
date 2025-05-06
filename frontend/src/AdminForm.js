import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Step,
  StepLabel,
  Stepper,
  Box,
  Container,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";


import StudentDetails from "./StudentDetails";
import ParentGuardianInfo from "./ParentGuardianInfo";
import AddressDetails from "./AddressDetails";
import EducationalBackground from "./EducationalBackground";
import CourseSelection from "./CourseSelection";
import DashboardHeader from "./Navbar";

const steps = [
  "Student Details",
  "Parent/Guardian Info",
  "Address Details",
  "Educational Background",
  "Course Selection",
];

const validationSchemas = [
  Yup.object({
    name: Yup.string().required("Required"),
    contactNo: Yup.string().required("Required"),
    gender: Yup.string().required("Required"),
    nationality: Yup.string().required("Required"),
    aadharNo: Yup.string().required("Required"),
    dateOfBirth: Yup.date().required("Required"),
    caste: Yup.string(),
    religion: Yup.string(),
    community: Yup.string(),
    communalCategory: Yup.string().oneOf(
      ["GEN", "BC", "BCM", "MBC", "DNC", "SC", "ST"],
      "Invalid Category"
    ),
  }),
  Yup.object({
    fatherName: Yup.string().required("Required"),
    fatherContactNo: Yup.string().required("Required"),
    fatherOccupation: Yup.string().required("Required"),
    fatherAadharNo: Yup.string().required("Required"),
    motherName: Yup.string().required("Required"),
    motherContactNo: Yup.string().required("Required"),
    motherOccupation: Yup.string().required("Required"),
    motherAadharNo: Yup.string().required("Required"),
    guardianName: Yup.string(),
    guardianContactNo: Yup.string(),
    guardianOccupation: Yup.string(),
    guardianAadharNo: Yup.string(),
  }),
  Yup.object({
    permanentAddressLine1: Yup.string().required("Required"),
    permanentAddressLine2: Yup.string(),
    permanentTaluk: Yup.string().required("Required"),
    permanentDistrict: Yup.string().required("Required"),
    permanentState: Yup.string().required("Required"),
    permanentPinCode: Yup.string().required("Required"),
    communicationAddressLine1: Yup.string().required("Required"),
    communicationAddressLine2: Yup.string(),
    communicationTaluk: Yup.string().required("Required"),
    communicationDistrict: Yup.string().required("Required"),
    communicationState: Yup.string().required("Required"),
    communicationPinCode: Yup.string().required("Required"),
  }),
  Yup.object({
    lastSchoolAttended: Yup.string().required("Required"),
    lastClassCompleted: Yup.string()
      .oneOf(["ITI", "10th", "12th"], "Invalid Class")
      .required("Required"),
    yearOfPassing: Yup.string().required("Required"),
    emisNumberOrTC: Yup.string().required("Required"),
  }),
  Yup.object({
    courseSelected: Yup.string().required("Required"),
    mediumOfInstruction: Yup.string().required("Required"),
    hostelDayScholarOrBus: Yup.string()
      .oneOf(["Hostel", "Day Scholar", "College Bus"], "Invalid Option")
      .required("Required"),
    extraCurricularActivity: Yup.string(),
    physicallyChallenged: Yup.boolean(),
    exServiceManChild: Yup.boolean(),
    belongsToAndamanNicobar: Yup.boolean(),
    dateOfAdmission: Yup.date().required("Date of Admission is required"),
    rollNumber: Yup.string().required("Roll Number is required"),
  }),
];

const initialValues = {
  name: "",
  contactNo: "",
  gender: "",
  nationality: "",
  aadharNo: "",
  dateOfBirth: "",
  caste: "",
  religion: "",
  community: "",
  communalCategory: "",
  fatherName: "",
  fatherContactNo: "",
  fatherOccupation: "",
  fatherAadharNo: "",
  motherName: "",
  motherContactNo: "",
  motherOccupation: "",
  motherAadharNo: "",
  guardianName: "",
  guardianContactNo: "",
  guardianOccupation: "",
  guardianAadharNo: "",
  permanentAddressLine1: "",
  permanentAddressLine2: "",
  permanentTaluk: "",
  permanentDistrict: "",
  permanentState: "",
  permanentPinCode: "",
  communicationAddressLine1: "",
  communicationAddressLine2: "",
  communicationTaluk: "",
  communicationDistrict: "",
  communicationState: "",
  communicationPinCode: "",
  lastSchoolAttended: "",
  lastClassCompleted: "",
  yearOfPassing: "",
  emisNumberOrTC: "",
  courseSelected: "",
  mediumOfInstruction: "",
  hostelDayScholarOrBus: "",
  extraCurricularActivity: "",
  dateOfAdmission: "",
  rollNumber: "",
  physicallyChallenged: false,
  exServiceManChild: false,
  belongsToAndamanNicobar: false,
};

const AdmissionForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  

  const handleNext = async (values, actions) => {
    const currentValidationSchema = validationSchemas[activeStep];

    try {
      await currentValidationSchema.validate(values, { abortEarly: false });

      let student_id = studentId;

      if (activeStep === 0) {
        student_id = generateStudentId();
        const payload = { ...values, student_id };

        await axios.post(
          "http://localhost:8000/admission/create_new_student",
          payload
        );

        sessionStorage.setItem("student_id", student_id);
        setStudentId(student_id); // ⚠️ This fixes the crash in step 1

        console.log("✅ Student created at step 0");
      } else {
        if (!student_id) throw new Error("No student ID found in local state");

        const payload = { ...values };
        await axios.put(
          `http://localhost:8000/admission/update_student_by_id/${student_id}`,
          payload
        );

        console.log(`✅ Student updated at step ${activeStep}`);
      }

      setActiveStep((prev) => prev + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    } catch (err) {
      if (err.name === "ValidationError") {
        const fieldErrors = {};
        err.inner.forEach((e) => {
          fieldErrors[e.path] = e.message;
        });
        actions.setErrors(fieldErrors);
      } else {
        console.error(
          "❌ Backend error:",
          err.response ? err.response.data : err.message
        );
        alert("Something went wrong while saving data. Try again.");
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // const handleSubmitDemo = (values) => {
  //   console.log('Final Submission:', values);
  //   // Handle backend submit here
  // };

  const [studentId, setStudentId] = useState(() =>
    sessionStorage.getItem("student_id")
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <StudentDetails />;
      case 1:
        return <ParentGuardianInfo />;
      case 2:
        return <AddressDetails />;
      case 3:
        return <EducationalBackground />;
      case 4:
        return <CourseSelection />;
      default:
        return null;
    }
  };

  const generateStudentId = () => {
    const timestamp = Date.now();
    return `STU-${timestamp}`;
  };

  const handleCreateStudent = async (values) => {
    const student_id = generateStudentId(); // <-- now it's used
    const payload = { ...values, student_id };

    try {
      await axios.post(
        "http://localhost:8000/admission/create_student",
        payload
      );
      sessionStorage.setItem("student_id", student_id);
      alert("Student created!");
    } catch (err) {
      console.error(err);
      alert("Failed to create student");
    }
  };

  const handleUpdate = async (values) => {
    const student_id = sessionStorage.getItem("student_id");
    try {
      await axios.put(
        `http://localhost:8000/admission/update_student_by_studentid/${student_id}`,
        values
      );
      alert("Student data updated!");
    } catch (err) {
      console.error(err);
      alert("Error updating student");
    }
  };

  const handleSubmit = async (values, actions) => {
    const isLastStep = activeStep === steps.length - 1;

    const student_id = studentId || sessionStorage.getItem("student_id");

    if (!student_id) {
      alert("No student ID found. Please restart the form.");
      return;
    }

    if (isLastStep) {
      try {
        const payload = { ...values };
        await axios.put(
          `http://localhost:8000/admission/update_student_by_id/${student_id}`,
          payload
        );
        console.log("✅ Final PUT request sent on Submit");
        alert("Form submitted successfully ✅");
      } catch (err) {
        console.error(
          "❌ Final Submit Error:",
          err.response ? err.response.data : err.message
        );
        alert("Failed to submit final form. Try again.");
      } finally {
        actions.setSubmitting(false);
      }
    } else {
      handleNext(values, actions);
    }
  };

  sessionStorage.removeItem("student_id");

  return (
    <>
    <DashboardHeader />
      <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            fontWeight="bold"
          >
            Admission Form
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchemas[activeStep]}
            onSubmit={handleSubmit} // 🔥 Plug it in here
          >
            {(formikProps) => (
              <Form>
                <Stepper
                  activeStep={activeStep}
                  alternativeLabel
                  sx={{ mb: 4 }}
                >
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <Box>{getStepContent(activeStep)}</Box>

                <Box
                  mt={4}
                  display="flex"
                  justifyContent="space-between"
                  flexDirection={{ xs: "column", sm: "row" }}
                  gap={2}
                >
                  {activeStep > 0 && (
                    <Button variant="outlined" onClick={handleBack} fullWidth>
                      Back
                    </Button>
                  )}
                  {activeStep < steps.length - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        handleNext(formikProps.values, formikProps)
                      }
                      fullWidth
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      fullWidth
                      onClick={() => navigate("/table")}
                    >
                      Submit
                    </Button>
                  )}
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Container>
    </>
  );
};

export default AdmissionForm;
