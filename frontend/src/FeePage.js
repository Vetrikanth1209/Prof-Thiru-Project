import { useState, useEffect } from "react"
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Grid,
  Box,
  Card,
  CardContent,
  Chip,
  Fade,
  Grow,
  useMediaQuery,
  useTheme,
  TableContainer,
  Tooltip,
  Alert,
  Snackbar,
  InputAdornment,
} from "@mui/material"

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Add as AddIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
  CalendarMonth as CalendarIcon,
  Payments as PaymentsIcon,
  Category as CategoryIcon,
} from "@mui/icons-material"
import { createFee, getAllFees, updateFee, deleteFee, getAllAcademicYears, getAllCourseCodes } from "./axios"

function FeePage() {
  const [formData, setFormData] = useState({
    feeId: "",
    academicYear: "",
    courseCode: "",
    feeType: "Tuition Fee",
    category: "",
    tuitionFees1: 0,
    tuitionFees2: 0,
    examFees: 0,
    notebookFees: 0,
    uniformFees: 0,
    miscellaneousFees: 0,
    otherFees: 0,
    dueDate: new Date(),
  })
  const [fees, setFees] = useState([])
  const [academicYears, setAcademicYears] = useState([])
  const [courseCodes, setCourseCodes] = useState([])
  const [editingFeeId, setEditingFeeId] = useState(null)
  const [error, setError] = useState(null)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feesData, yearsData, codesData] = await Promise.all([
          getAllFees(),
          getAllAcademicYears(),
          getAllCourseCodes(),
        ])
        setFees(feesData)
        setAcademicYears(yearsData)
        setCourseCodes(codesData)
        setError(null)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to fetch data")
        showSnackbar("Failed to fetch data", "error")
      }
    }
    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: name.includes("Fees") ? Number(value) : value })
  }

  const handleDueDateChange = (newDate) => {
    setFormData({ ...formData, dueDate: newDate })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.feeType) {
      setError("Fee Type is required")
      showSnackbar("Please select a Fee Type", "error")
      return
    }
    if (!formData.academicYear) {
      setError("Academic Year is required")
      showSnackbar("Please select an Academic Year", "error")
      return
    }
    if (!formData.courseCode) {
      setError("Course Code is required")
      showSnackbar("Please select a Course Code", "error")
      return
    }

    const formattedData = {
      ...formData,
      dueDate: formData.dueDate.toISOString().split("T")[0],
    }

    try {
      if (editingFeeId) {
        await updateFee({ feeId: editingFeeId, ...formattedData })
        setEditingFeeId(null)
        showSnackbar("Fee updated successfully!", "success")
      } else {
        await createFee(formattedData)
        showSnackbar("Fee created successfully!", "success")
      }
      const feesData = await getAllFees()
      setFees(feesData)
      resetForm()
      setError(null)
    } catch (error) {
      console.error("Error saving fee:", error)
      setError("Failed to save fee")
      showSnackbar("Failed to save fee", "error")
    }
  }

  const handleEdit = (fee) => {
    const dueDate = new Date(fee.dueDate)
    setFormData({
      feeId: fee.feeId,
      academicYear: fee.academicYear,
      courseCode: fee.courseCode,
      feeType: fee.feeType,
      category: fee.category,
      tuitionFees1: fee.tuitionFees1,
      tuitionFees2: fee.tuitionFees2,
      examFees: fee.examFees,
      notebookFees: fee.notebookFees,
      uniformFees: fee.uniformFees,
      miscellaneousFees: fee.miscellaneousFees,
      otherFees: fee.otherFees,
      dueDate: dueDate,
    })
    setEditingFeeId(fee.feeId)
  }

  const handleDelete = async (feeId) => {
    try {
      await deleteFee(feeId)
      const feesData = await getAllFees()
      setFees(feesData)
      setError(null)
      showSnackbar("Fee deleted successfully!", "success")
    } catch (error) {
      console.error("Error deleting fee:", error)
      setError("Failed to delete fee")
      showSnackbar("Failed to delete fee", "error")
    }
  }

  const resetForm = () => {
    setFormData({
      feeId: "",
      academicYear: "",
      courseCode: "",
      feeType: "Tuition Fee",
      category: "",
      tuitionFees1: 0,
      tuitionFees2: 0,
      examFees: 0,
      notebookFees: 0,
      uniformFees: 0,
      miscellaneousFees: 0,
      otherFees: 0,
      dueDate: new Date(),
    })
    setEditingFeeId(null)
  }

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setOpenSnackbar(true)
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  const getCategoryColor = (category) => {
    const colors = {
      BC: { bg: "#e3f2fd", text: "#1565c0" },
      BCM: { bg: "#e8f5e9", text: "#2e7d32" },
      MBC: { bg: "#f3e5f5", text: "#7b1fa2" },
      DNC: { bg: "#fff3e0", text: "#e65100" },
      SC: { bg: "#e8eaf6", text: "#3949ab" },
      ST: { bg: "#fce4ec", text: "#c2185b" },
      All: { bg: "#f5f5f5", text: "#424242" },
    }
    return colors[category] || { bg: "#f5f5f5", text: "#424242" }
  }

  const getFeeTypeIcon = (feeType) => {
    switch (feeType) {
      case "Tuition Fee":
        return <SchoolIcon fontSize="small" />
      case "Admission Fee":
        return <PaymentsIcon fontSize="small" />
      case "Uniform Fee":
      case "Note Book Fee":
      case "Hostel Fee":
      case "Transport Fee":
      case "Others":
      default:
        return <CategoryIcon fontSize="small" />
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const styles = {
    container: {
      minHeight: "100vh",
      padding: isMobile ? "16px" : "32px",
      maxWidth: "100%",
    },
    header: {
      color: "#334e68",
      fontWeight: 700,
      marginBottom: "30px",
      textAlign: "center",
      position: "relative",
      "&:after": {
        content: '""',
        position: "absolute",
        bottom: "-10px",
        left: "50%",
        width: "80px",
        height: "4px",
        background: "#6366f1",
        transform: "translateX(-50%)",
      },
    },
    formCard: {
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      overflow: "hidden",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      background: "white",
      marginBottom: "30px",
    },
    formHeader: {
      background: "#6366f1",
      color: "white",
      padding: "16px 24px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    formContent: {
      padding: "24px",
    },
    // Updated consistent styling for all form inputs
    inputField: {
      marginBottom: "16px",
      "& .MuiOutlinedInput-root": {
        height: "56px", // Fixed height for all inputs
        "&:hover fieldset": {
          borderColor: "#6366f1",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#6366f1",
        },
      },
      "& .MuiInputLabel-root": {
        "&.Mui-focused": {
          color: "#6366f1",
        },
      },
      "& .MuiInputAdornment-root": {
        height: "56px",
      },
    },
    datePicker: {
      "& .MuiOutlinedInput-root": {
        height: "56px", // Match other field heights
        "&:hover fieldset": {
          borderColor: "#6366f1",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#6366f1",
        },
      },
      "& .MuiInputLabel-root.Mui-focused": {
        color: "#6366f1",
      },
    },
    select: {
      marginBottom: "16px",
      "& .MuiOutlinedInput-root": {
        height: "56px", // Match height with other inputs
        "&:hover fieldset": {
          borderColor: "#6366f1",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#6366f1",
        },
      },
      "& .MuiInputLabel-root.Mui-focused": {
        color: "#6366f1",
      },
    },
    categorySelect: {
      marginBottom: "16px",
      "& .MuiOutlinedInput-root": {
        height: "56px", // Match height with other inputs
        "&:hover fieldset": {
          borderColor: "#6366f1",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#6366f1",
        },
      },
      "& .MuiInputLabel-root": {
        "&.Mui-focused": {
          color: "#6366f1",
        },
      },
    },
    button: {
      borderRadius: "8px",
      padding: "10px 24px",
      fontWeight: 600,
      textTransform: "none",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 6px 8px rgba(0,0,0,0.15)",
      },
    },
    createButton: {
      background: "#6366f1",
      color: "white",
      "&:hover": {
        background: "#4f46e5",
      },
    },
    cancelButton: {
      background: "#ef4444",
      color: "white",
      marginLeft: "10px",
      "&:hover": {
        background: "#dc2626",
      },
    },
    tableContainer: {
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      overflow: "hidden",
    },
    tableHeader: {
      background: "#6366f1",
    },
    tableHeaderCell: {
      color: "white",
      fontWeight: "bold",
      fontSize: "1rem",
    },
    tableRow: {
      transition: "background-color 0.3s ease",
      "&:hover": {
        backgroundColor: "#edf2f7 !important",
      },
    },
    editButton: {
      color: "#6366f1",
      "&:hover": {
        background: "rgba(99, 102, 241, 0.1)",
      },
    },
    deleteButton: {
      color: "#ef4444",
      "&:hover": {
        background: "rgba(239, 68, 68, 0.1)",
      },
    },
    chip: {
      fontWeight: "bold",
      borderRadius: "6px",
    },
    yearDisplay: {
      fontWeight: "medium",
      color: "#4a5568",
    },
  }

  return (
    <>
      <Container sx={styles.container}>
        <Grow in={true} timeout={800}>
          <Box>
            <Typography variant="h4" sx={styles.header}>
              Fee Management System
            </Typography>
          </Box>
        </Grow>

        {error && (
          <Fade in={true} timeout={500}>
            <Alert
              severity="error"
              sx={{ marginBottom: "20px", borderRadius: "8px" }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          </Fade>
        )}

        <Fade in={true} timeout={1000}>
          <Card sx={styles.formCard}>
            <Box sx={styles.formHeader}>
              <PaymentsIcon />
              <Typography variant="h6">{editingFeeId ? "Update Fee" : "Create New Fee"}</Typography>
            </Box>
            <CardContent sx={styles.formContent}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl variant="outlined" fullWidth required sx={styles.categorySelect}>
                      <InputLabel>Category</InputLabel>
                      <Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        label="Category"
                      >
                        <MenuItem value="BC">BC</MenuItem>
                        <MenuItem value="BCM">BCM</MenuItem>
                        <MenuItem value="MBC">MBC</MenuItem>
                        <MenuItem value="DNC">DNC</MenuItem>
                        <MenuItem value="SC">SC</MenuItem>
                        <MenuItem value="ST">ST</MenuItem>
                        <MenuItem value="All">All</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl variant="outlined" fullWidth required sx={styles.select}>
                      <InputLabel>Academic Year</InputLabel>
                      <Select
                        name="academicYear"
                        value={formData.academicYear}
                        onChange={handleChange}
                        label="Academic Year"
                      >
                        {academicYears.map((year) => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl variant="outlined" fullWidth required sx={styles.select}>
                      <InputLabel>Course Code</InputLabel>
                      <Select
                        name="courseCode"
                        value={formData.courseCode}
                        onChange={handleChange}
                        label="Course Code"
                      >
                        {courseCodes.map((code) => (
                          <MenuItem key={code} value={code}>
                            {code}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl variant="outlined" fullWidth required sx={styles.select}>
                      <InputLabel>Fee Type</InputLabel>
                      <Select
                        name="feeType"
                        value={formData.feeType}
                        onChange={handleChange}
                        label="Fee Type"
                      >
                        <MenuItem value="Tuition Fee">Tuition Fee</MenuItem>
                        <MenuItem value="Admission Fee">Admission Fee</MenuItem>
                        <MenuItem value="Uniform Fee">Uniform Fee</MenuItem>
                        <MenuItem value="Note Book Fee">Note Book Fee</MenuItem>
                        <MenuItem value="Hostel Fee">Hostel Fee</MenuItem>
                        <MenuItem value="Transport Fee">Transport Fee</MenuItem>
                        <MenuItem value="Others">Others</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Tuition Fees 1"
                      name="tuitionFees1"
                      type="number"
                      value={formData.tuitionFees1}
                      onChange={handleChange}
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                      sx={styles.inputField}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Tuition Fees 2"
                      name="tuitionFees2"
                      type="number"
                      value={formData.tuitionFees2}
                      onChange={handleChange}
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                      sx={styles.inputField}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Exam Fees"
                      name="examFees"
                      type="number"
                      value={formData.examFees}
                      onChange={handleChange}
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                      sx={styles.inputField}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Notebook Fees"
                      name="notebookFees"
                      type="number"
                      value={formData.notebookFees}
                      onChange={handleChange}
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                      sx={styles.inputField}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Uniform Fees"
                      name="uniformFees"
                      type="number"
                      value={formData.uniformFees}
                      onChange={handleChange}
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                      sx={styles.inputField}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Miscellaneous Fees"
                      name="miscellaneousFees"
                      type="number"
                      value={formData.miscellaneousFees}
                      onChange={handleChange}
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                      sx={styles.inputField}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Other Fees"
                      name="otherFees"
                      type="number"
                      value={formData.otherFees}
                      onChange={handleChange}
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                      sx={styles.inputField}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Due Date"
                      type="date"
                      name="dueDate"
                      value={formData.dueDate.toISOString().split('T')[0]}
                      onChange={(e) => handleDueDateChange(new Date(e.target.value))}
                      variant="outlined"
                      fullWidth
                      required
                      InputLabelProps={{ shrink: true }}
                      sx={styles.inputField}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={editingFeeId ? <SaveIcon /> : <AddIcon />}
                    sx={{ ...styles.button, ...styles.createButton }}
                  >
                    {editingFeeId ? "Update Fee" : "Create Fee"}
                  </Button>
                  {editingFeeId && (
                    <Button
                      variant="contained"
                      startIcon={<CancelIcon />}
                      onClick={resetForm}
                      sx={{ ...styles.button, ...styles.cancelButton }}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </form>
            </CardContent>
          </Card>
        </Fade>

        <Box sx={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
          <PaymentsIcon sx={{ color: "#6366f1", marginRight: "10px" }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#334e68" }}>
            Fees List
          </Typography>
        </Box>

        <Fade in={true} timeout={1200}>
          <TableContainer component={Paper} sx={styles.tableContainer}>
            <Table>
              <TableHead>
                <TableRow sx={styles.tableHeader}>
                  {!isMobile && <TableCell sx={styles.tableHeaderCell}>Fee ID</TableCell>}
                  <TableCell sx={styles.tableHeaderCell}>Academic Year</TableCell>
                  {!isMobile && <TableCell sx={styles.tableHeaderCell}>Course Code</TableCell>}
                  <TableCell sx={styles.tableHeaderCell}>Fee Type</TableCell>
                  {!isTablet && <TableCell sx={styles.tableHeaderCell}>Category</TableCell>}
                  <TableCell sx={styles.tableHeaderCell}>Total Fees</TableCell>
                  {!isMobile && <TableCell sx={styles.tableHeaderCell}>Due Date</TableCell>}
                  <TableCell sx={styles.tableHeaderCell}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isMobile ? 5 : isTablet ? 6 : 8} align="center">
                      <Typography sx={{ padding: "20px", color: "#718096" }}>
                        No fees available. Add your first fee!
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  fees.map((fee) => {
                    const categoryColor = getCategoryColor(fee.category)
                    return (
                      <TableRow key={fee.feeId} sx={styles.tableRow}>
                        {!isMobile && <TableCell>{fee.feeId}</TableCell>}
                        <TableCell>
                          <Chip
                            icon={<CalendarIcon sx={{ fontSize: 16 }} />}
                            label={fee.academicYear}
                            size="small"
                            sx={{
                              ...styles.chip,
                              backgroundColor: "#ebf4ff",
                              color: "#4c51bf",
                            }}
                          />
                        </TableCell>
                        {!isMobile && <TableCell>{fee.courseCode}</TableCell>}
                        <TableCell>
                          <Chip
                            icon={getFeeTypeIcon(fee.feeType)}
                            label={fee.feeType}
                            size="small"
                            sx={{
                              ...styles.chip,
                              backgroundColor: "#f0f9ff",
                              color: "#0369a1",
                            }}
                          />
                        </TableCell>
                        {!isTablet && (
                          <TableCell>
                            <Chip
                              label={fee.category}
                              size="small"
                              sx={{
                                ...styles.chip,
                                backgroundColor: categoryColor.bg,
                                color: categoryColor.text,
                              }}
                            />
                          </TableCell>
                        )}
                        <TableCell>
                          <Typography sx={{ fontWeight: "bold", color: "#047857" }}>
                            {formatCurrency(fee.totalFees)}
                          </Typography>
                        </TableCell>
                        {!isMobile && (
                          <TableCell>
                            <Chip
                              icon={<CalendarIcon sx={{ fontSize: 16 }} />}
                              label={new Date(fee.dueDate).toLocaleDateString()}
                              size="small"
                              sx={{
                                ...styles.chip,
                                backgroundColor: "#fff1f2",
                                color: "#be123c",
                              }}
                            />
                          </TableCell>
                        )}
                        <TableCell>
                          <Box sx={{ display: "flex" }}>
                            <Tooltip title="Edit Fee">
                              <IconButton onClick={() => handleEdit(fee)} sx={styles.editButton}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Fee">
                              <IconButton
                                onClick={() => handleDelete(fee.feeId)}
                                sx={styles.deleteButton}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Fade>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: "100%", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", borderRadius: "8px" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </>
  )
}

export default FeePage