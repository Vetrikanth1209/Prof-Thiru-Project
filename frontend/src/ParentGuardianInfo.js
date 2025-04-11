import React from 'react';
import { TextField, Grid } from '@mui/material';
import { useFormikContext } from 'formik';

const ParentGuardianInfo = () => {
  const { getFieldProps, touched, errors } = useFormikContext();

  return (
    <Grid container spacing={2}>
      {/* Father Info */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Father's Name"
          fullWidth
          {...getFieldProps('fatherName')}
          error={touched.fatherName && Boolean(errors.fatherName)}
          helperText={touched.fatherName && errors.fatherName}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Father's Contact No"
          fullWidth
          {...getFieldProps('fatherContactNo')}
          error={touched.fatherContactNo && Boolean(errors.fatherContactNo)}
          helperText={touched.fatherContactNo && errors.fatherContactNo}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Father's Occupation"
          fullWidth
          {...getFieldProps('fatherOccupation')}
          error={touched.fatherOccupation && Boolean(errors.fatherOccupation)}
          helperText={touched.fatherOccupation && errors.fatherOccupation}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Father's Aadhar No"
          fullWidth
          {...getFieldProps('fatherAadharNo')}
          error={touched.fatherAadharNo && Boolean(errors.fatherAadharNo)}
          helperText={touched.fatherAadharNo && errors.fatherAadharNo}
        />
      </Grid>

      {/* Mother Info */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Mother's Name"
          fullWidth
          {...getFieldProps('motherName')}
          error={touched.motherName && Boolean(errors.motherName)}
          helperText={touched.motherName && errors.motherName}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Mother's Contact No"
          fullWidth
          {...getFieldProps('motherContactNo')}
          error={touched.motherContactNo && Boolean(errors.motherContactNo)}
          helperText={touched.motherContactNo && errors.motherContactNo}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Mother's Occupation"
          fullWidth
          {...getFieldProps('motherOccupation')}
          error={touched.motherOccupation && Boolean(errors.motherOccupation)}
          helperText={touched.motherOccupation && errors.motherOccupation}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Mother's Aadhar No"
          fullWidth
          {...getFieldProps('motherAadharNo')}
          error={touched.motherAadharNo && Boolean(errors.motherAadharNo)}
          helperText={touched.motherAadharNo && errors.motherAadharNo}
        />
      </Grid>

      {/* Guardian Info */}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Guardian Name"
          fullWidth
          {...getFieldProps('guardianName')}
          error={touched.guardianName && Boolean(errors.guardianName)}
          helperText={touched.guardianName && errors.guardianName}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Guardian Contact No"
          fullWidth
          {...getFieldProps('guardianContactNo')}
          error={touched.guardianContactNo && Boolean(errors.guardianContactNo)}
          helperText={touched.guardianContactNo && errors.guardianContactNo}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Guardian Occupation"
          fullWidth
          {...getFieldProps('guardianOccupation')}
          error={touched.guardianOccupation && Boolean(errors.guardianOccupation)}
          helperText={touched.guardianOccupation && errors.guardianOccupation}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Guardian Aadhar No"
          fullWidth
          {...getFieldProps('guardianAadharNo')}
          error={touched.guardianAadharNo && Boolean(errors.guardianAadharNo)}
          helperText={touched.guardianAadharNo && errors.guardianAadharNo}
        />
      </Grid>
    </Grid>
  );
};

export default ParentGuardianInfo;
