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

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1); // start from page 1
  const [loading, setLoading] = useState(true);
  const [rowCount, setRowCount] = useState(0); // total number of students

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
        id: (currentPage - 1) * 10 + index + 1,
        ...student,
      }));

      setStudents(withIds);
      setRowCount(total); // backend should send this!
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

  const columns = [
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

  return (
   <>
   <DashboardHeader />
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          🎓 All Student Records
        </Typography>

        {loading && students.length === 0 ? (
          <Box mt={4} display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box mt={4} height={{ xs: 400, md: 600 }}>
              <DataGrid
                rows={students}
                columns={columns}
                pageSize={10}
                paginationMode="server"
                rowCount={rowCount}
                loading={loading}
                hideFooter
                disableSelectionOnClick
                checkboxSelection
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: 2,
                  backgroundColor: '#fff',  
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f0f0f0',
                    fontWeight: 'bold',
                  },
                }}
              />
            </Box>

            <Box display="flex" justifyContent="center" mt={3} gap={2}>
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={page === 1 || loading}
              >
                Previous
              </Button>
              <Typography variant="body1" align="center" mt={1}>
                Page {page}
              </Typography>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={page * 10 >= rowCount || loading}
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
