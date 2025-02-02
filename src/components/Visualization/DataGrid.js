import React, { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { database } from "../../config/firebase";
import { CircularProgress, Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const DataGridLog = () => {
  const [batches, setBatches] = useState([]);
  const [employees, setEmployees] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define DataGrid columns
  const columns = [
    { field: "recipeName", headerName: "Recipe Name", width: 200 },
    { field: "quantity", headerName: "Quantity", width: 100 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "orderName", headerName: "Order Name", width: 150 },
    {
      field: "employee",
      headerName: "Employee",
      width: 200,
      valueGetter: (params) => {
        if (!params || !params.row) return "Unknown";
        return employees?.[params.row.employeeId]?.name || "Unknown";
      },
    },
    {
      field: "dosage",
      headerName: "Dosage",
      width: 300,
      valueGetter: (params) => {
        if (!params || !params.row || !params.row.dosage) return "N/A";
        return Object.values(params.row.dosage)
          .map((dose) => `${dose.cannabinoid || "N/A"}: ${dose.mg || 0}mg`)
          .join(", ");
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch batches
        const batchesRef = ref(database, "batches");
        const batchesSnapshot = await get(batchesRef);

        // Fetch employees
        const employeesRef = ref(database, "employees");
        const employeesSnapshot = await get(employeesRef);

        if (batchesSnapshot.exists()) {
          // Transform batches data
          const sortedBatches = Object.entries(batchesSnapshot.val()).map(
            ([id, data]) => ({
              id, // Add the Firebase ID as a property
              ...data, // Spread the rest of the batch data
            })
          );
          setBatches(sortedBatches);
        } else {
          setError("No batches available.");
        }

        if (employeesSnapshot.exists()) {
          setEmployees(employeesSnapshot.val());
        }
      } catch (err) {
        setError(`Failed to fetch data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "80px" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "80px" }}
      >
        <Typography color="error">{`Error: ${error}`}</Typography>
      </Box>
    );
  }

  if (!batches || batches.length === 0) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "80px" }}
      >
        <Typography variant="h6">No data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 600, width: "100%", padding: "16px" }}>
      <DataGrid
        rows={batches}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
};

export default DataGridLog;
