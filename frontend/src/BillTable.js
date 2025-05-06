import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { getAllFees, deleteFee } from "./axios"; // Adjust path if needed
import { BillTemplate } from "./BillTemplate"; // Adjust path if needed

const BillTable = ({ handleEdit }) => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFees = async () => {
    try {
      const data = await getAllFees();
      setFees(data.bills || []);
    } catch (err) {
      console.error("Error fetching fees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleDelete = async (billId) => {
    try {
      await deleteFee(billId);
      setFees((prev) => prev.filter((fee) => fee.billId !== billId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const columns = [
    { field: "billId", headerName: "Bill ID", flex: 1 },
    { field: "academicYear", headerName: "Academic Year", flex: 1 },
    { field: "courseCode", headerName: "Course Code", flex: 1 },
    { field: "rollNo", headerName: "Roll No", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    {
      field: "oldFees",
      headerName: "Old Fees",
      flex: 1,
      valueGetter: (params) => params?.row?.feesDetails?.oldFees ?? 0,
    },
    {
      field: "newFees",
      headerName: "New Fees",
      flex: 1,
      valueGetter: (params) => params?.row?.feesDetails?.newFees ?? 0,
    },
    { field: "discount", headerName: "Discount", flex: 1 },
    { field: "fine", headerName: "Fine", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.billId)}>
            <DeleteIcon />
          </IconButton>
          <IconButton color="secondary" onClick={() => BillTemplate(params.row)}>
            <PictureAsPdfIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        All Bills
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box height="70vh">
          <DataGrid
            rows={fees.map((fee) => ({ ...fee, id: fee.billId }))}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
          />
        </Box>
      )}
    </Box>
  );
};

export default BillTable;
