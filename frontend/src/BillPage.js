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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  CircularProgress,
} from "@mui/material"
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
  Add as AddIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
  CalendarMonth as CalendarIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material"
import { createBill, getAllBills, updateBill, deleteBill, getAllFees } from "./axios"
import BillTemplate from "./BillTemplate"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import axios from "axios"

function BillPage() {
  const [formData, setFormData] = useState({
    billId: "",
    academicYear: "",
    courseCode: "",
    category: "",
    feesDetails: {
      tuitionFees1: "",
      tuitionFees2: "",
      examFees: "",
      notebookFees: "",
      uniformFees: "",
      miscellaneousFees: "",
      otherFees: "",
      totalFees: "",
    },
    dueDate: "2025-06-30",
  })
  const [bills, setBills] = useState([])
  const [totalBills, setTotalBills] = useState(0)
  const [academicYears, setAcademicYears] = useState([])
  const [courseCodes, setCourseCodes] = useState([])
  const [categories] = useState(["General", "OBC", "SC/ST", "MBC", "EWS", "Other"])
  const [fees, setFees] = useState([])
  const [editingBillId, setEditingBillId] = useState(null)
  const [page, setPage] = useState(1)
  const [limit] = useState(5)
  const [error, setError] = useState(null)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [loading, setLoading] = useState(true)
  const [loadingAcademicYears, setLoadingAcademicYears] = useState(true)
  const [loadingCourseCodes, setLoadingCourseCodes] = useState(true)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  useEffect(() => {
    fetchBills()
    fetchAcademicYears()
    fetchCourseCodes()
    fetchFees()
  }, [page])

  const fetchBills = async () => {
    try {
      setLoading(true)
      const response = await getAllBills(page, limit)
      setBills(response.bills || [])
      setTotalBills(response.total || 0)
      setError(null)
    } catch (error) {
      console.error("Error fetching bills:", error)
      setError("Failed to fetch bills")
      showSnackbar("Failed to fetch bills", "error")
    } finally {
      setLoading(false)
    }
  }

  const fetchAcademicYears = async () => {
    try {
      setLoadingAcademicYears(true)
      const response = await axios.get("http://localhost:8000/courses/get_all_academic_years")
      setAcademicYears(response.data || [])
      setError(null)
    } catch (error) {
      console.error("Error fetching academic years:", error)
      setError("Failed to fetch academic years")
      showSnackbar("Failed to fetch academic years", "error")
    } finally {
      setLoadingAcademicYears(false)
    }
  }

  const fetchCourseCodes = async () => {
    try {
      setLoadingCourseCodes(true)
      const response = await axios.get("http://localhost:8000/courses/get_all_course_codes")
      setCourseCodes(response.data || [])
      setError(null)
    } catch (error) {
      console.error("Error fetching course codes:", error)
      setError("Failed to fetch course codes")
      showSnackbar("Failed to fetch course codes", "error")
    } finally {
      setLoadingCourseCodes(false)
    }
  }

  const fetchFees = async () => {
    try {
      const data = await getAllFees()
      setFees(data)
    } catch (error) {
      console.error("Error fetching fees data:", error)
      setError("Failed to fetch fees data")
      showSnackbar("Failed to fetch fees data", "error")
    }
  }

  const fetchFeeDetails = async (academicYear, courseCode, category) => {
    try {
      const response = await axios.post("http://localhost:8000/fees/get_fees_by_criteria", {
        academicYear,
        courseCode,
        category,
      })
      const feeData = response.data[0] // Assuming the first matching fee is used
      if (feeData) {
        setFormData((prev) => ({
          ...prev,
          feesDetails: {
            tuitionFees1: feeData.tuitionFees1 || "",
            tuitionFees2: feeData.tuitionFees2 || "",
            examFees: feeData.examFees || "",
            notebookFees: feeData.notebookFees || "",
            uniformFees: feeData.uniformFees || "",
            miscellaneousFees: feeData.miscellaneousFees || "",
            otherFees: feeData.otherFees || "",
            totalFees: feeData.totalFees || "",
          },
          dueDate: feeData.dueDate || "2025-06-30",
        }))
      } else {
        resetFeeDetails()
      }
    } catch (error) {
      console.error("Error fetching fee details:", error)
      setError("Failed to fetch fee details")
      showSnackbar("Failed to fetch fee details", "error")
      resetFeeDetails()
    }
  }

  const resetFeeDetails = () => {
    setFormData((prev) => ({
      ...prev,
      feesDetails: {
        tuitionFees1: "",
        tuitionFees2: "",
        examFees: "",
        notebookFees: "",
        uniformFees: "",
        miscellaneousFees: "",
        otherFees: "",
        totalFees: "",
      },
      dueDate: "2025-06-30",
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Fetch fee details when academicYear, courseCode, and category are all selected
    if (name === "academicYear" || name === "courseCode" || name === "category") {
      const updatedFormData = { ...formData, [name]: value }
      if (updatedFormData.academicYear && updatedFormData.courseCode && updatedFormData.category) {
        fetchFeeDetails(updatedFormData.academicYear, updatedFormData.courseCode, updatedFormData.category)
      } else {
        resetFeeDetails()
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.academicYear || !formData.courseCode || !formData.category) {
      setError("All required fields must be filled")
      showSnackbar("All required fields must be filled", "error")
      return
    }

    try {
      const billPayload = { ...formData }
      delete billPayload.dueDate
      if (editingBillId) {
        await updateBill({ billId: editingBillId, ...billPayload })
        showSnackbar("Bill updated successfully!", "success")
      } else {
        await createBill(billPayload)
        showSnackbar("Bill created successfully!", "success")
      }
      setEditingBillId(null)
      fetchBills()
      resetForm()
    } catch (error) {
      console.error("Error saving bill:", error)
      setError(error.response?.data?.error || "Failed to save bill")
      showSnackbar(error.response?.data?.error || "Failed to save bill", "error")
    }
  }

  const handleEdit = (bill) => {
    setFormData({
      billId: bill.billId,
      academicYear: bill.academicYear,
      courseCode: bill.courseCode,
      category: bill.category || "",
      feesDetails: {
        tuitionFees1: bill.feesDetails.tuitionFees1 || "",
        tuitionFees2: bill.feesDetails.tuitionFees2 || "",
        examFees: bill.feesDetails.examFees || "",
        notebookFees: bill.feesDetails.notebookFees || "",
        uniformFees: bill.feesDetails.uniformFees || "",
        miscellaneousFees: bill.feesDetails.miscellaneousFees || "",
        otherFees: bill.feesDetails.otherFees || "",
        totalFees: bill.feesDetails.totalFees || "",
      },
      dueDate: bill.dueDate || "2025-06-30",
    })
    setEditingBillId(bill.billId)
  }

  const handleDelete = async (billId) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      try {
        await deleteBill(billId)
        showSnackbar("Bill deleted successfully!", "success")
        fetchBills()
      } catch (error) {
        console.error("Error deleting bill:", error)
        setError(error.response?.data?.error || "Failed to delete bill")
        showSnackbar(error.response?.data?.error || "Failed to delete bill", "error")
      }
    }
  }

  const generateBillPDF = (bill) => {
    const billForTemplate = { ...bill }
    const input = document.createElement("div")
    input.style.position = "absolute"
    input.style.left = "-9999px"
    document.body.appendChild(input)

    const { createRoot } = require("react-dom/client")
    const root = createRoot(input)
    root.render(<BillTemplate bill={billForTemplate} />)

    setTimeout(() => {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png")
        const pdf = new jsPDF("l", "mm", "a4")
        const imgProps = pdf.getImageProperties(imgData)
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
        pdf.save(`bill_${bill.billId}.pdf`)
        document.body.removeChild(input)
      })
    }, 100)
  }

  const resetForm = () => {
    setFormData({
      billId: "",
      academicYear: "",
      courseCode: "",
      category: "",
      feesDetails: {
        tuitionFees1: "",
        tuitionFees2: "",
        examFees: "",
        notebookFees: "",
        uniformFees: "",
        miscellaneousFees: "",
        otherFees: "",
        totalFees: "",
      },
      dueDate: "2025-06-30",
    })
    setEditingBillId(null)
  }

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setOpenSnackbar(true)
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
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
    textField: {
      marginBottom: "16px",
      "& .MuiOutlinedInput-root": {
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
      "& .MuiOutlinedInput-root": {
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
    paginationButton: {
      background: "#6366f1",
      color: "white",
      "&:hover": {
        background: "#4f46e5",
      },
      "&.Mui-disabled": {
        background: "#cbd5e1",
        color: "#64748b",
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
    pdfButton: {
      color: "#0891b2",
      "&:hover": {
        background: "rgba(8, 145, 178, 0.1)",
      },
    },
    chip: {
      fontWeight: "bold",
      borderRadius: "6px",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "20px",
      gap: "16px",
    },
    pageInfo: {
      fontWeight: "medium",
      color: "#334e68",
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px 0",
    },
  }

  return (
    <Container sx={styles.container}>
      <Grow in={true} timeout={800}>
        <Box>
          <Typography variant="h4" sx={styles.header}>
            Bill Management System
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
            <ReceiptIcon />
            <Typography variant="h6">{editingBillId ? "Update Bill" : "Create New Bill"}</Typography>
          </Box>
          <CardContent sx={styles.formContent}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* First Row: Academic Year, Category, Course Code */}
                <Grid item xs={12} md={4}>
                  <FormControl variant="outlined" fullWidth sx={styles.select}>
                    <InputLabel>Academic Year</InputLabel>
                    <Select
                      name="academicYear"
                      value={formData.academicYear}
                      onChange={handleChange}
                      label="Academic Year"
                      disabled={loadingAcademicYears}
                      required
                    >
                      {loadingAcademicYears ? (
                        <MenuItem disabled>Loading...</MenuItem>
                      ) : academicYears.length === 0 ? (
                        <MenuItem disabled>No academic years available</MenuItem>
                      ) : (
                        academicYears.map((year) => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl variant="outlined" fullWidth sx={styles.select}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      label="Category"
                      required
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl variant="outlined" fullWidth sx={styles.select}>
                    <InputLabel>Course Code</InputLabel>
                    <Select
                      name="courseCode"
                      value={formData.courseCode}
                      onChange={handleChange}
                      label="Course Code"
                      disabled={loadingCourseCodes}
                      required
                    >
                      {loadingCourseCodes ? (
                        <MenuItem disabled>Loading...</MenuItem>
                      ) : courseCodes.length === 0 ? (
                        <MenuItem disabled>No course codes available</MenuItem>
                      ) : (
                        courseCodes.map((code) => (
                          <MenuItem key={code} value={code}>
                            {code}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Second Row: Tuition Fees 1, Tuition Fees 2, Exam Fees, Notebook Fees */}
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Tuition Fees 1"
                    name="feesDetails.tuitionFees1"
                    type="number"
                    value={formData.feesDetails.tuitionFees1}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                      readOnly: true,
                    }}
                    sx={styles.textField}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Tuition Fees 2"
                    name="feesDetails.tuitionFees2"
                    type="number"
                    value={formData.feesDetails.tuitionFees2}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                      readOnly: true,
                    }}
                    sx={styles.textField}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Exam Fees"
                    name="feesDetails.examFees"
                    type="number"
                    value={formData.feesDetails.examFees}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                      readOnly: true,
                    }}
                    sx={styles.textField}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Notebook Fees"
                    name="feesDetails.notebookFees"
                    type="number"
                    value={formData.feesDetails.notebookFees}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                      readOnly: true,
                    }}
                    sx={styles.textField}
                  />
                </Grid>

                {/* Third Row: Uniform Fees, Miscellaneous Fees, Other Fees, Total Fees */}
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Uniform Fees"
                    name="feesDetails.uniformFees"
                    type="number"
                    value={formData.feesDetails.uniformFees}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                      readOnly: true,
                    }}
                    sx={styles.textField}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Miscellaneous Fees"
                    name="feesDetails.miscellaneousFees"
                    type="number"
                    value={formData.feesDetails.miscellaneousFees}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                      readOnly: true,
                    }}
                    sx={styles.textField}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Other Fees"
                    name="feesDetails.otherFees"
                    type="number"
                    value={formData.feesDetails.otherFees}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                      readOnly: true,
                    }}
                    sx={styles.textField}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Total Fees"
                    name="feesDetails.totalFees"
                    type="number"
                    value={formData.feesDetails.totalFees}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                      readOnly: true,
                    }}
                    sx={styles.textField}
                  />
                </Grid>
              </Grid>
              <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={editingBillId ? <SaveIcon /> : <AddIcon />}
                  sx={{ ...styles.button, ...styles.createButton }}
                >
                  {editingBillId ? "Update Bill" : "Create Bill"}
                </Button>
                {editingBillId && (
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
        <ReceiptIcon sx={{ color: "#6366f1", marginRight: "10px" }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#334e68" }}>
          Bills List
        </Typography>
      </Box>

      {loading ? (
        <Box sx={styles.loadingContainer}>
          <CircularProgress sx={{ color: "#6366f1" }} />
        </Box>
      ) : bills.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: "8px" }}>
          No bills available. Add your first bill!
        </Alert>
      ) : (
        <Fade in={true} timeout={1200}>
          <Box>
            <TableContainer component={Paper} sx={styles.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow sx={styles.tableHeader}>
                    {!isMobile && <TableCell sx={styles.tableHeaderCell}>Bill ID</TableCell>}
                    <TableCell sx={styles.tableHeaderCell}>Academic Year</TableCell>
                    {!isMobile && <TableCell sx={styles.tableHeaderCell}>Course Code</TableCell>}
                    {!isMobile && <TableCell sx={styles.tableHeaderCell}>Category</TableCell>}
                    <TableCell sx={styles.tableHeaderCell}>Total Fees</TableCell>
                    <TableCell sx={styles.tableHeaderCell}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bills.map((bill) => (
                    <TableRow key={bill.billId} sx={styles.tableRow}>
                      {!isMobile && <TableCell>{bill.billId}</TableCell>}
                      <TableCell>
                        <Chip
                          icon={<CalendarIcon sx={{ fontSize: 16 }} />}
                          label={bill.academicYear}
                          size="small"
                          sx={{
                            ...styles.chip,
                            backgroundColor: "#ebf4ff",
                            color: "#4c51bf",
                          }}
                        />
                      </TableCell>
                      {!isMobile && <TableCell>{bill.courseCode}</TableCell>}
                      {!isMobile && <TableCell>{bill.category}</TableCell>}
                      <TableCell>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color: "#047857",
                          }}
                        >
                          {formatCurrency(bill.feesDetails.totalFees)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex" }}>
                          <Tooltip title="Edit Bill">
                            <IconButton onClick={() => handleEdit(bill)} sx={styles.editButton}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Bill">
                            <IconButton onClick={() => handleDelete(bill.billId)} sx={styles.deleteButton}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Generate PDF">
                            <IconButton onClick={() => generateBillPDF(bill)} sx={styles.pdfButton}>
                              <PdfIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={styles.pagination}>
              <Button
                variant="contained"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                sx={{ ...styles.button, ...styles.paginationButton }}
              >
                Previous
              </Button>
              <Typography sx={styles.pageInfo}>
                Page {page} of {Math.ceil(totalBills / limit) || 1}
              </Typography>
              <Button
                variant="contained"
                onClick={() => setPage(page + 1)}
                disabled={bills.length < limit || page >= Math.ceil(totalBills / limit)}
                sx={{ ...styles.button, ...styles.paginationButton }}
              >
                Next
              </Button>
            </Box>
          </Box>
        </Fade>
      )}

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

export default BillPage