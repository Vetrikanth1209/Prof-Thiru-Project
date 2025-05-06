import React from 'react';
import { Grid, TextField, MenuItem, InputLabel, FormControl, Select } from '@mui/material';
import { useFormikContext } from 'formik';

const communalCategories = ['GEN', 'BC', 'BCM', 'MBC', 'DNC', 'SC', 'ST'];

const StudentDetails = () => {
  const { values, touched, errors, getFieldProps } = useFormikContext();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Name"
          fullWidth
          {...getFieldProps('name')}
          error={touched.name && Boolean(errors.name)}
          helperText={touched.name && errors.name}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="Contact Number"
          fullWidth
          {...getFieldProps('contactNo')}
          error={touched.contactNo && Boolean(errors.contactNo)}
          helperText={touched.contactNo && errors.contactNo}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="Gender"
          fullWidth
          {...getFieldProps('gender')}
          error={touched.gender && Boolean(errors.gender)}
          helperText={touched.gender && errors.gender}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="Nationality"
          fullWidth
          {...getFieldProps('nationality')}
          error={touched.nationality && Boolean(errors.nationality)}
          helperText={touched.nationality && errors.nationality}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="Aadhar Number"
          fullWidth
          {...getFieldProps('aadharNo')}
          error={touched.aadharNo && Boolean(errors.aadharNo)}
          helperText={touched.aadharNo && errors.aadharNo}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="Date of Birth"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          {...getFieldProps('dateOfBirth')}
          error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
          helperText={touched.dateOfBirth && errors.dateOfBirth}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="Caste"
          fullWidth
          {...getFieldProps('caste')}
          error={touched.caste && Boolean(errors.caste)}
          helperText={touched.caste && errors.caste}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="Religion"
          fullWidth
          {...getFieldProps('religion')}
          error={touched.religion && Boolean(errors.religion)}
          helperText={touched.religion && errors.religion}
        />
      </Grid>
      

      <Grid item xs={12} sm={6}>
        <TextField
          label="Community"
          fullWidth
          {...getFieldProps('community')}
          error={touched.community && Boolean(errors.community)}
          helperText={touched.community && errors.community}
        />
      </Grid>


     
      <FormControl fullWidth error={touched.communalCategory && Boolean(errors.communalCategory)}>
          <InputLabel>Communal Category</InputLabel>
          <Select
            label="Communal Category"
            {...getFieldProps('communalCategory')}
            value={values.communalCategory}
          >
            {communalCategories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {touched.communalCategory && errors.communalCategory && (
          <p style={{ color: 'red', fontSize: '0.75rem' }}>{errors.communalCategory}</p>
        )}
    
    </Grid>
  );
};

export default StudentDetails;
