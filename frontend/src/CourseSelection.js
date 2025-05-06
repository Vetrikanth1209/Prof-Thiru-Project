import React from 'react';
import {
  TextField,
  Grid,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from '@mui/material';
import { useFormikContext } from 'formik';

const CourseSelection = () => {
  const { getFieldProps, touched, errors, values, setFieldValue } = useFormikContext();

  return (
    <Grid container spacing={2}>
      {/* Course Selected */}
      <Grid item xs={12} sm={6}>
  <TextField
    select
    fullWidth
    label="Course Selected"
    {...getFieldProps('courseSelected')}
    value={values.courseSelected || ''} // ensure it's always a string
    onChange={(e) => setFieldValue('courseSelected', e.target.value)}
    error={touched.courseSelected && Boolean(errors.courseSelected)}
    helperText={touched.courseSelected && errors.courseSelected}
  >
    <MenuItem value="BCA">BCA</MenuItem>
    <MenuItem value="BSc">BSc</MenuItem>
    <MenuItem value="BA">BA</MenuItem>
  </TextField>
</Grid>


      {/* Medium of Instruction */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Medium of Instruction"
          fullWidth
          {...getFieldProps('mediumOfInstruction')}
          error={touched.mediumOfInstruction && Boolean(errors.mediumOfInstruction)}
          helperText={touched.mediumOfInstruction && errors.mediumOfInstruction}
        />
      </Grid>

      {/* Hostel / Day Scholar / Bus */}
      <Grid item xs={12} sm={6}>
        <TextField
          select
          fullWidth
          label="Hostel / Day Scholar / College Bus"
          {...getFieldProps('hostelDayScholarOrBus')}
          error={touched.hostelDayScholarOrBus && Boolean(errors.hostelDayScholarOrBus)}
          helperText={touched.hostelDayScholarOrBus && errors.hostelDayScholarOrBus}
        >
          <MenuItem value="Hostel">Hostel</MenuItem>
          <MenuItem value="Day Scholar">Day Scholar</MenuItem>
          <MenuItem value="College Bus">College Bus</MenuItem>
        </TextField>
      </Grid>

      {/* Extra Curricular Activities */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Extra Curricular Activities"
          fullWidth
          {...getFieldProps('extraCurricularActivity')}
          error={touched.extraCurricularActivity && Boolean(errors.extraCurricularActivity)}
          helperText={touched.extraCurricularActivity && errors.extraCurricularActivity}
        />
      </Grid>

      {/* Date of Admission */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Date of Admission"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          {...getFieldProps('dateOfAdmission')}
          error={touched.dateOfAdmission && Boolean(errors.dateOfAdmission)}
          helperText={touched.dateOfAdmission && errors.dateOfAdmission}
        />
      </Grid>

      {/* Roll Number */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Roll Number"
          fullWidth
          {...getFieldProps('rollNumber')}
          error={touched.rollNumber && Boolean(errors.rollNumber)}
          helperText={touched.rollNumber && errors.rollNumber}
        />
      </Grid>

      {/* Booleans as Checkboxes */}
      <Grid item xs={12}>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={values.physicallyChallenged}
                onChange={(e) => setFieldValue('physicallyChallenged', e.target.checked)}
              />
            }
            label="Physically Challenged"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={values.exServiceManChild}
                onChange={(e) => setFieldValue('exServiceManChild', e.target.checked)}
              />
            }
            label="Ex-Serviceman's Child"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={values.belongsToAndamanNicobar}
                onChange={(e) => setFieldValue('belongsToAndamanNicobar', e.target.checked)}
              />
            }
            label="From Andaman & Nicobar"
          />
        </FormGroup>
      </Grid>
    </Grid>
  );
};

export default CourseSelection;
