import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Paper,
  Alert,
} from '@mui/material';
import { createBill, updateBill } from '../services/api';

const BillForm = ({ selectedBill, setSelectedBill, refreshBills }) => {
  const initialFormData = {
    billId: '',
    academicYear: '',
    rollNo: '',
    name: '',
    feesDetails: { oldFees: '', newFees: '' },
    discount: '',
    fine: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (selectedBill) {
      setFormData({
        billId: selectedBill.billId,
        academicYear: selectedBill.academicYear,
        rollNo: selectedBill.rollNo,
        name: selectedBill.name,
        feesDetails: {
          oldFees: selectedBill.feesDetails.oldFees || '',
          newFees: selectedBill.feesDetails.newFees || '',
        },
        discount: selectedBill.discount || '',
        fine: selectedBill.fine || '',
      });
    } else {
      setFormData(initialFormData);
    }
  }, [selectedBill]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('feesDetails.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        feesDetails: { ...formData.feesDetails, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate required fields
    if (
      !formData.academicYear ||
      !formData.rollNo ||
      !formData.name ||
      !formData.feesDetails.oldFees ||
      !formData.feesDetails.newFees
    ) {
      setError('All required fields must be filled');
      return;
    }

    try {
      if (selectedBill) {
        await updateBill(formData);
        setSuccess('Bill updated successfully!');
      } else {
        await createBill(formData);
        setSuccess('Bill created successfully!');
      }
      setFormData(initialFormData);
      setSelectedBill(null);
      refreshBills();
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setSelectedBill(null);
    setError('');
    setSuccess('');
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {selectedBill ? 'Edit Bill' : 'Create New Bill'}
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Academic Year"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Roll No"
              name="rollNo"
              value={formData.rollNo}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Old Fees"
              name="feesDetails.oldFees"
              type="number"
              value={formData.feesDetails.oldFees}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="New Fees"
              name="feesDetails.newFees"
              type="number"
              value={formData.feesDetails.newFees}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Discount"
              name="discount"
              type="number"
              value={formData.discount}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fine"
              name="fine"
              type="number"
              value={formData.fine}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                {selectedBill ? 'Update' : 'Create'}
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleReset}>
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default BillForm;