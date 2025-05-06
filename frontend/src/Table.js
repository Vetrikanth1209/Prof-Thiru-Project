import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Box,
  Button,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DashboardHeader from './Navbar';
import { useNavigate } from 'react-router-dom';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [rowCount, setRowCount] = useState(0);
  const navigate = useNavigate();

  const loggedData = JSON.parse(sessionStorage.getItem('logged') || '{}');
  const isAdmin = loggedData.user?.admin === true;

  const fetchStudents = async (currentPage) => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/admission/get_all_student', {
        params: {
          page: currentPage,
          limit: 10,
        },
      });

      const { students, total } = res.data;

      const withIds = students.map((student, index) => ({
        id: (currentPage - 1) * 10 + index + 1, // used by DataGrid
        student_id: student.student_id, // retained for edit/delete
        ...student,
      }));

      setStudents(withIds);
      setRowCount(total);
      console.log('Fetched students:', res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(page);
  }, [page]);

  const handleNext = () => {
    if (page * 10 < rowCount) {
      setPage(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  const handleDelete = async (studentId) => {
    const confirm = window.confirm("Are you sure you want to delete this student?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:8000/admission/delete_student_id/${studentId}`);
      alert("Student deleted successfully!");
      fetchStudents(page);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete student.");
    }
  };

  const handleEdit = (student) => {
    console.log('Editing student:', student.student_id);
    navigate(`/edit_student/${student.student_id}`);
  };

  const baseColumns = [
    { field: 'applicationNo', headerName: 'Application No', width: 150 },
    { field: 'rollNumber', headerName: 'Roll No', width: 130 },
    { field: 'admissionNo', headerName: 'Admission No', width: 150 },
    { field: 'name', headerName: 'Name', width: 160 },
    { field: 'contactNo', headerName: 'Contact No', width: 150 },
    { field: 'gender', headerName: 'Gender', width: 100 },
    { field: 'nationality', headerName: 'Nationality', width: 120 },
    { field: 'aadharNo', headerName: 'Aadhar No', width: 170 },
    { field: 'dateOfBirth', headerName: 'DOB', width: 130 },
    { field: 'caste', headerName: 'Caste', width: 100 },
    { field: 'religion', headerName: 'Religion', width: 100 },
    { field: 'community', headerName: 'Community', width: 130 },
    { field: 'communalCategory', headerName: 'Category', width: 130 },
    { field: 'fatherName', headerName: 'Father Name', width: 160 },
    { field: 'fatherContactNo', headerName: 'Father Contact', width: 150 },
    { field: 'fatherOccupation', headerName: 'Father Job', width: 140 },
    { field: 'fatherAadharNo', headerName: 'Father Aadhar', width: 170 },
    { field: 'motherName', headerName: 'Mother Name', width: 160 },
    { field: 'motherContactNo', headerName: 'Mother Contact', width: 150 },
    { field: 'motherOccupation', headerName: 'Mother Job', width: 140 },
    { field: 'motherAadharNo', headerName: 'Mother Aadhar', width: 170 },
    { field: 'guardianName', headerName: 'Guardian Name', width: 160 },
    { field: 'guardianContactNo', headerName: 'Guardian Contact', width: 150 },
    { field: 'guardianOccupation', headerName: 'Guardian Job', width: 140 },
    { field: 'guardianAadharNo', headerName: 'Guardian Aadhar', width: 170 },
    { field: 'permanentAddressLine1', headerName: 'Perm Addr Line 1', width: 180 },
    { field: 'permanentAddressLine2', headerName: 'Perm Addr Line 2', width: 180 },
    { field: 'permanentTaluk', headerName: 'Perm Taluk', width: 140 },
    { field: 'permanentDistrict', headerName: 'Perm District', width: 140 },
    { field: 'permanentState', headerName: 'Perm State', width: 140 },
    { field: 'permanentPinCode', headerName: 'Perm Pin', width: 120 },
    { field: 'communicationAddressLine1', headerName: 'Comm Addr Line 1', width: 180 },
    { field: 'communicationAddressLine2', headerName: 'Comm Addr Line 2', width: 180 },
    { field: 'communicationTaluk', headerName: 'Comm Taluk', width: 140 },
    { field: 'communicationDistrict', headerName: 'Comm District', width: 140 },
    { field: 'communicationState', headerName: 'Comm State', width: 140 },
    { field: 'communicationPinCode', headerName: 'Comm Pin', width: 120 },
    { field: 'lastSchoolAttended', headerName: 'Last School', width: 160 },
    { field: 'lastClassCompleted', headerName: 'Last Class', width: 130 },
    { field: 'yearOfPassing', headerName: 'Year Passed', width: 120 },
    { field: 'emisNumberOrTC', headerName: 'EMIS / TC No.', width: 150 },
    { field: 'courseSelected', headerName: 'Course', width: 140 },
    { field: 'mediumOfInstruction', headerName: 'Medium', width: 130 },
    { field: 'hostelDayScholarOrBus', headerName: 'Hostel/Bus', width: 150 },
    { field: 'extraCurricularActivity', headerName: 'Extra Activity', width: 160 },
    { field: 'physicallyChallenged', headerName: 'Physically Challenged', width: 180, type: 'boolean' },
    { field: 'exServiceManChild', headerName: 'Ex-Service Child', width: 160, type: 'boolean' },
    { field: 'belongsToAndamanNicobar', headerName: 'Andaman/Nicobar?', width: 170, type: 'boolean' },
    { field: 'dateOfAdmission', headerName: 'Admission Date', width: 150 },
  ];

  const adminColumns = isAdmin
    ? [
        ...baseColumns,
        {
          field: 'actions',
          headerName: 'Actions',
          width: 200,
          renderCell: (params) => (
            <>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                sx={{ mr: 1 }}
                onClick={() => handleEdit(params.row)} 
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleDelete(params.row.student_id)}
              >
                Delete
              </Button>
            </>
          ),
        },
      ]
    : baseColumns;

  return (
    <>
      <DashboardHeader />
      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
          <Typography variant="h4" align="center" fontWeight="bold" gutterBottom color="primary">
            w All Student Records
          </Typography>

          {loading && students.length === 0 ? (
            <Box mt={4} display="flex" justifyContent="center">
              <CircularProgress size={50} color="secondary" />
            </Box>
          ) : (
            <>
              <Box mt={4} height={{ xs: 400, md: 600 }} sx={{ backgroundColor: '#f9f9f9', borderRadius: 2 }}>
                <DataGrid
                  rows={students}
                  columns={adminColumns}
                  pageSize={10}
                  paginationMode="server"
                  rowCount={rowCount}
                  loading={loading}
                  hideFooter
                  disableSelectionOnClick
                  checkboxSelection
                  sx={{
                    border: 'none',
                    borderRadius: 2,
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: '#e0e0e0',
                      fontWeight: 'bold',
                      color: '#333',
                    },
                    '& .MuiDataGrid-cell': {
                      fontSize: '14px',
                      color: '#444',
                    },
                    '& .MuiButton-root': {
                      textTransform: 'none',
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>

              <Box display="flex" justifyContent="center" mt={3} gap={2}>
                <Button
                  variant="outlined"
                  onClick={handlePrevious}
                  disabled={page === 1 || loading}
                  sx={{ padding: '6px 16px' }}
                >
                  Previous
                </Button>
                <Typography variant="body1" align="center" mt={1} fontWeight="bold">
                  Page {page}
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={page * 10 >= rowCount || loading}
                  sx={{ padding: '6px 16px' }}
                >
                  Next
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default StudentsPage;
