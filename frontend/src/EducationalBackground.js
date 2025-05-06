import React from 'react';
import { TextField, Grid, MenuItem } from '@mui/material';
import { useFormikContext } from 'formik';

const EducationalBackground = () => {
  const { getFieldProps, touched, errors } = useFormikContext();

  return (
    <Grid container spacing={2}>
      {/* Last School Attended */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Last School Attended"
          {...getFieldProps('lastSchoolAttended')}
          error={touched.lastSchoolAttended && Boolean(errors.lastSchoolAttended)}
          helperText={touched.lastSchoolAttended && errors.lastSchoolAttended}
        />
      </Grid>

      {/* Last Class Completed */}
      <Grid item xs={12} sm={6}>
        <TextField
          select
          fullWidth
          label="Last Class Completed"
          {...getFieldProps('lastClassCompleted')}
          error={touched.lastClassCompleted && Boolean(errors.lastClassCompleted)}
          helperText={touched.lastClassCompleted && errors.lastClassCompleted}
        >
          {['ITI', '10th', '12th'].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* Year of Passing */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Year of Passing"
          type="number"
          {...getFieldProps('yearOfPassing')}
          error={touched.yearOfPassing && Boolean(errors.yearOfPassing)}
          helperText={touched.yearOfPassing && errors.yearOfPassing}
        />
      </Grid>

      {/* EMIS Number or Transfer Certificate */}
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="EMIS Number / Transfer Certificate"
          {...getFieldProps('emisNumberOrTC')}
          error={touched.emisNumberOrTC && Boolean(errors.emisNumberOrTC)}
          helperText={touched.emisNumberOrTC && errors.emisNumberOrTC}
        />
      </Grid>
    </Grid>
  );
};

export default EducationalBackground;
