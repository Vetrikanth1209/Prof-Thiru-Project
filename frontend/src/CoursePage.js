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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material"
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Add as AddIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
} from "@mui/icons-material"
import { createCourse, getAllCourses, updateCourse, deleteCourse } from "./axios"

function CoursePage() {
  // Generate year options (current year - 5 to current year + 10)
  const currentYear = new Date().getFullYear()
  const yearOptions = []
  for (let i = currentYear - 5; i <= currentYear + 10; i++) {
    yearOptions.push(i)
  }

  const [fromYear, setFromYear] = useState(currentYear)
  const [toYear, setToYear] = useState(currentYear + 1)
  const [formData, setFormData] = useState({ 
    courseId: "", 
    academicYear: `${currentYear}-${currentYear + 1}`, 
    courseCode: "", 
    courseName: "" 
  })
  const [courses, setCourses] = useState([])
  const [editingCourseId, setEditingCourseId] = useState(null)
  const [error, setError] = useState(null)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  useEffect(() => {
    fetchCourses()
  }, [])

  // Update academicYear when fromYear or toYear changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      academicYear: `${fromYear}-${toYear}`
    }))
  }, [fromYear, toYear])

  // Parse academicYear when editing a course
  useEffect(() => {
    if (editingCourseId && formData.academicYear) {
      const [from, to] = formData.academicYear.split('-')
      if (from && to) {
        setFromYear(parseInt(from))
        setToYear(parseInt(to))
      }
    }
  }, [editingCourseId, formData.academicYear])

  const fetchCourses = async () => {
    try {
      const data = await getAllCourses()
      setCourses(data)
      setError(null)
    } catch (error) {
      console.error("Error fetching courses:", error)
      setError("Failed to fetch courses")
      showSnackbar("Failed to fetch courses", "error")
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFromYearChange = (e) => {
    const value = parseInt(e.target.value)
    setFromYear(value)
    // Ensure toYear is always greater than fromYear
    if (value >= toYear) {
      setToYear(value + 1)
    }
  }

  const handleToYearChange = (e) => {
    const value = parseInt(e.target.value)
    setToYear(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCourseId) {
        await updateCourse({ courseId: editingCourseId, ...formData })
        setEditingCourseId(null)
        showSnackbar("Course updated successfully!", "success")
      } else {
        await createCourse(formData)
        showSnackbar("Course created successfully!", "success")
      }
      fetchCourses()
      resetForm()
      setError(null)
    } catch (error) {
      console.error("Error saving course:", error)
      setError("Failed to save course")
      showSnackbar("Failed to save course", "error")
    }
  }

  const handleEdit = (course) => {
    setFormData({
      courseId: course.courseId,
      academicYear: course.academicYear,
      courseCode: course.courseCode,
      courseName: course.courseName,
    })
    setEditingCourseId(course.courseId)
  }

  const handleDelete = async (courseId) => {
    try {
      await deleteCourse(courseId)
      fetchCourses()
      setError(null)
      showSnackbar("Course deleted successfully!", "success")
    } catch (error) {
      console.error("Error deleting course:", error)
      setError("Failed to delete course")
      showSnackbar("Failed to delete course", "error")
    }
  }

  const resetForm = () => {
    setFormData({ courseId: "", academicYear: `${currentYear}-${currentYear + 1}`, courseCode: "", courseName: "" })
    setFromYear(currentYear)
    setToYear(currentYear + 1)
    setEditingCourseId(null)
  }

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setOpenSnackbar(true)
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  // Custom styles
  const styles = {
    container: {
      minHeight: "100vh",
      padding: isMobile ? "16px" : "32px",
      maxWidth: "100%",
    },
    header: {
      color: "#2c3e50",
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
        background: "#3498db",
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
      background: "#3498db",
      color: "white",
      padding: "16px 24px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    formContent: {
      padding: "24px",
    },
    textField: {
      marginBottom: "16px",
      "& .MuiOutlinedInput-root": {
        "&:hover fieldset": {
          borderColor: "#3498db",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#3498db",
        },
      },
      "& .MuiInputLabel-root.Mui-focused": {
        color: "#3498db",
      },
    },
    selectField: {
      marginBottom: "16px",
      "& .MuiOutlinedInput-root": {
        "&:hover fieldset": {
          borderColor: "#3498db",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#3498db",
        },
      },
      "& .MuiInputLabel-root.Mui-focused": {
        color: "#3498db",
      },
    },
    academicYearContainer: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      marginBottom: "16px",
    },
    yearInputContainer: {
      flex: 1,
    },
    yearDivider: {
      fontWeight: "bold",
      color: "#7f8c8d",
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
      background: "#3498db",
      color: "white",
      "&:hover": {
        background: "#2980b9",
      },
    },
    cancelButton: {
      background: "#e74c3c",
      color: "white",
      marginLeft: "10px",
      "&:hover": {
        background: "#c0392b",
      },
    },
    tableContainer: {
      borderRadius: "12px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      overflow: "hidden",
    },
    tableHeader: {
      background: "#3498db",
    },
    tableHeaderCell: {
      color: "white",
      fontWeight: "bold",
      fontSize: "1rem",
    },
    tableRow: {
      transition: "background-color 0.3s ease",
      "&:hover": {
        backgroundColor: "#ecf0f1 !important",
      },
    },
    editButton: {
      color: "#3498db",
      "&:hover": {
        background: "rgba(52, 152, 219, 0.1)",
      },
    },
    deleteButton: {
      color: "#e74c3c",
      "&:hover": {
        background: "rgba(231, 76, 60, 0.1)",
      },
    },
    chip: {
      fontWeight: "bold",
      borderRadius: "6px",
    },
  }

  return (
    <Container sx={styles.container}>
      <Grow in={true} timeout={800}>
        <Box>
          <Typography variant="h4" sx={styles.header}>
            Course Management System
          </Typography>
        </Box>
      </Grow>

      {error && (
        <Fade in={true} timeout={500}>
          <Alert severity="error" sx={{ marginBottom: "20px", borderRadius: "8px" }} onClose={() => setError(null)}>
            {error}
          </Alert>
        </Fade>
      )}

      <Fade in={true} timeout={1000}>
        <Card sx={styles.formCard}>
          <Box sx={styles.formHeader}>
            <SchoolIcon />
            <Typography variant="h6">{editingCourseId ? "Update Course" : "Create New Course"}</Typography>
          </Box>
          <CardContent sx={styles.formContent}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Academic Year</Typography>
                  <Box sx={styles.academicYearContainer}>
                    <FormControl variant="outlined" sx={styles.yearInputContainer}>
                      <InputLabel>From Year</InputLabel>
                      <Select
                        value={fromYear}
                        onChange={handleFromYearChange}
                        label="From Year"
                        fullWidth
                      >
                        {yearOptions.map((year) => (
                          <MenuItem key={`from-${year}`} value={year}>
                            {year}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Typography variant="body1" sx={styles.yearDivider}>
                      -
                    </Typography>
                    <FormControl variant="outlined" sx={styles.yearInputContainer}>
                      <InputLabel>To Year</InputLabel>
                      <Select
                        value={toYear}
                        onChange={handleToYearChange}
                        label="To Year"
                        fullWidth
                        disabled={fromYear >= yearOptions[yearOptions.length - 1]}
                      >
                        {yearOptions
                          .filter((year) => year > fromYear)
                          .map((year) => (
                            <MenuItem key={`to-${year}`} value={year}>
                              {year}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Box>
                  {/* Hidden field to store the combined academic year value */}
                  <input 
                    type="hidden" 
                    name="academicYear" 
                    value={formData.academicYear} 
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Course Code"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    required
                    sx={styles.textField}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Course Name"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    required
                    sx={styles.textField}
                  />
                </Grid>
              </Grid>
              <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={editingCourseId ? <SaveIcon /> : <AddIcon />}
                  sx={{ ...styles.button, ...styles.createButton }}
                >
                  {editingCourseId ? "Update Course" : "Create Course"}
                </Button>
                {editingCourseId && (
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
        <SchoolIcon sx={{ color: "#3498db", marginRight: "10px" }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#2c3e50" }}>
          Courses List
        </Typography>
      </Box>

      <Fade in={true} timeout={1200}>
        <TableContainer component={Paper} sx={styles.tableContainer}>
          <Table>
            <TableHead>
              <TableRow sx={styles.tableHeader}>
                {!isMobile && <TableCell sx={styles.tableHeaderCell}>Course ID</TableCell>}
                <TableCell sx={styles.tableHeaderCell}>Academic Year</TableCell>
                <TableCell sx={styles.tableHeaderCell}>Course Code</TableCell>
                {!isTablet && <TableCell sx={styles.tableHeaderCell}>Course Name</TableCell>}
                <TableCell sx={styles.tableHeaderCell}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isMobile ? 3 : isTablet ? 4 : 5} align="center">
                    <Typography sx={{ padding: "20px", color: "#7f8c8d" }}>
                      No courses available. Add your first course!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.courseId} sx={styles.tableRow}>
                    {!isMobile && <TableCell>{course.courseId}</TableCell>}
                    <TableCell>
                      <Chip
                        label={course.academicYear}
                        size="small"
                        sx={{
                          ...styles.chip,
                          backgroundColor: "#e3f2fd",
                          color: "#1976d2",
                        }}
                      />
                    </TableCell>
                    <TableCell>{course.courseCode}</TableCell>
                    {!isTablet && <TableCell>{course.courseName}</TableCell>}
                    <TableCell>
                      <Box sx={{ display: "flex" }}>
                        <Tooltip title="Edit Course">
                          <IconButton onClick={() => handleEdit(course)} sx={styles.editButton}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Course">
                          <IconButton onClick={() => handleDelete(course.courseId)} sx={styles.deleteButton}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
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
  )
}

export default CoursePage