import React from 'react';
import { TextField, Grid } from '@mui/material';
import { useFormikContext } from 'formik';

const AddressDetails = () => {
  const { getFieldProps, touched, errors } = useFormikContext();

  const renderFullWidthField = (label, name) => (
    <Grid item xs={12}>
      <TextField
        label={label}
        fullWidth
        {...getFieldProps(name)}
        error={touched[name] && Boolean(errors[name])}
        helperText={touched[name] && errors[name]}
      />
    </Grid>
  );

  return (
    <Grid container spacing={2}>
      {/* Permanent Address Section */}
      {renderFullWidthField('Permanent Address Line 1', 'permanentAddressLine1')}
      {renderFullWidthField('Permanent Address Line 2', 'permanentAddressLine2')}
      {renderFullWidthField('Permanent Taluk', 'permanentTaluk')}
      {renderFullWidthField('Permanent District', 'permanentDistrict')}
      {renderFullWidthField('Permanent State', 'permanentState')}
      {renderFullWidthField('Permanent Pincode', 'permanentPinCode')}

      {/* Communication Address Section */}
      {renderFullWidthField('Communication Address Line 1', 'communicationAddressLine1')}
      {renderFullWidthField('Communication Address Line 2', 'communicationAddressLine2')}
      {renderFullWidthField('Communication Taluk', 'communicationTaluk')}
      {renderFullWidthField('Communication District', 'communicationDistrict')}
      {renderFullWidthField('Communication State', 'communicationState')}
      {renderFullWidthField('Communication Pincode', 'communicationPinCode')}
    </Grid>
  );
};

export default AddressDetails;
