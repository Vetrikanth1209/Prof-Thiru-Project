import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Yup.object({ name: Yup.string().required("Name is required") }),
  Yup.object({ fatherName: Yup.string().required("Father Name is required") }),
  Yup.object({ permanentAddressLine1: Yup.string().required("Address is required") }),
  Yup.object({ lastSchoolAttended: Yup.string().required("Last school attended is required") }),
  Yup.object({ courseSelected: Yup.string().required("Course selection is required") }),
];

const defaultValues = {
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

const EditStudent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [initialValues, setInitialValues] = useState(defaultValues);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { student_id } = useParams();

  useEffect(() => {
    if (student_id) {
      setIsLoading(true);
      axios
        .get(`http://localhost:8000/admission/get_student_by_id/${student_id}`)
        .then((res) => {
          const data = res.data;
          console.log("📦 Fetched student data:", data);

          // Handle courseSelected specially since it's an array in the backend
          const courseSelectedValue = Array.isArray(data.courseSelected)
            ? data.courseSelected[0]
            : data.courseSelected || "";

          const mappedValues = {
            ...defaultValues,
            ...data,
            dateOfBirth: data.dateOfBirth ? data.dateOfBirth.substring(0, 10) : "",
            dateOfAdmission: data.dateOfAdmission ? data.dateOfAdmission.substring(0, 10) : "",
            courseSelected: courseSelectedValue,
            physicallyChallenged: Boolean(data.physicallyChallenged),
            exServiceManChild: Boolean(data.exServiceManChild),
            belongsToAndamanNicobar: Boolean(data.belongsToAndamanNicobar),
          };

          console.log("🎯 Mapped form values:", mappedValues);
          setInitialValues(mappedValues);
        })
        .catch((err) => {
          console.error("❌ Failed to fetch student data:", err);
          alert("Failed to load student data. Please try again later.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [student_id]);

  const handleStep = async (values, actions, step) => {
    try {
      await validationSchemas[activeStep].validate(values, { abortEarly: false });

      // Update the backend with current form data at each step
      const response = await axios.put(
        `http://localhost:8000/admission/update_student_by_id/${student_id}`,
        values
      );

      console.log("✅ Step data saved:", response.data);
      setActiveStep(step);
      actions.setTouched({});
      actions.setSubmitting(false);
    } catch (err) {
      if (err.name === "ValidationError") {
        const fieldErrors = {};
        err.inner.forEach((e) => (fieldErrors[e.path] = e.message));
        actions.setErrors(fieldErrors);
      } else {
        console.error("Save error:", err);
        alert("Something went wrong while saving data. Please try again.");
      }
      actions.setSubmitting(false);
    }
  };

  const handleNext = (values, actions) => {
    handleStep(values, actions, activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const getStepContent = (step, formikProps) => {
    switch (step) {
      case 0:
        return <StudentDetails formik={formikProps} />;
      case 1:
        return <ParentGuardianInfo formik={formikProps} />;
      case 2:
        return <AddressDetails formik={formikProps} />;
      case 3:
        return <EducationalBackground formik={formikProps} />;
      case 4:
        return <CourseSelection formik={formikProps} />;
      default:
        return null;
    }
  };

  const handleSubmit = async (values, actions) => {
    const isLastStep = activeStep === steps.length - 1;

    if (!student_id) {
      alert("No student ID found. Please restart the form.");
      return;
    }

    if (isLastStep) {
      try {
        actions.setSubmitting(true);
        const response = await axios.put(
          `http://localhost:8000/admission/update_student_by_id/${student_id}`,
          values
        );
        console.log("🎉 Form submitted successfully:", response.data);
        alert("Student information updated successfully ✅");
        navigate("/");
      } catch (err) {
        console.error("Final submission error:", err);
        alert("Final submission failed. Please try again.");
      } finally {
        actions.setSubmitting(false);
      }
    } else {
      handleNext(values, actions);
    }
  };

  if (isLoading) {
    return (
      <>
        <DashboardHeader />
        <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
          <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" align="center">
              Loading student data...
            </Typography>
          </Paper>
        </Container>
      </>
    );
  }

  return (
    <>
      <DashboardHeader />
      <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
            Edit Student Information
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
            Student ID: {student_id}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchemas[activeStep]}
            onSubmit={handleSubmit}
          >
            {(formikProps) => (
              <Form>
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <Box>{getStepContent(activeStep, formikProps)}</Box>

                <Box mt={4} display="flex" justifyContent="space-between" flexDirection={{ xs: "column", sm: "row" }} gap={2}>
                  {activeStep > 0 && (
                    <Button variant="outlined" onClick={handleBack} fullWidth>
                      Back
                    </Button>
                  )}

                  {activeStep < steps.length - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleNext(formikProps.values, formikProps)}
                      disabled={formikProps.isSubmitting}
                      fullWidth
                    >
                      {formikProps.isSubmitting ? "Saving..." : "Next"}
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="success" 
                      disabled={formikProps.isSubmitting}
                      fullWidth
                    >
                      {formikProps.isSubmitting ? "Submitting..." : "Submit"}
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

export default EditStudent;