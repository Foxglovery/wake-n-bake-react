import React, { useState } from "react";
import { ref, push } from "firebase/database";
import { database } from "../config/firebase";
import { TextField, Button, Box, Typography, Grid, Alert } from "@mui/material";

const AddBatch = () => {
  const [batch, setBatch] = useState({
    recipeName: "",
    quantity: "",
    date: "",
    dosage: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBatch((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError("");

    try {
      const dbRef = ref(database, "batches");
      const newBatch = { ...batch, dosage: parseDosage(batch.dosage) }; // Ensure dosage is structured properly
      await push(dbRef, newBatch);
      setSuccess(true);
      setBatch({
        recipeName: "",
        quantity: "",
        date: "",
        dosage: "",
      });
    } catch (err) {
      setError("Failed to add batch: " + err.message);
    }
  };

  const parseDosage = (dosage) => {
    // Convert dosage string to object, e.g., "THC:5,CBD:10" -> { THC: 5, CBD: 10 }
    if (!dosage) return {};
    return dosage.split(",").reduce((acc, dose) => {
      const [key, value] = dose.split(":");
      acc[key.trim()] = parseFloat(value.trim());
      return acc;
    }, {});
  };

  return (
    <Box
      sx={{ maxWidth: 500, margin: "auto", marginTop: "20px", padding: "16px" }}
    >
      <Typography variant="h5" textAlign="center" gutterBottom>
        Add a New Batch
      </Typography>
      {success && <Alert severity="success">Batch added successfully!</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Recipe Name"
              name="recipeName"
              value={batch.recipeName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              type="number"
              value={batch.quantity}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              value={batch.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Dosage (e.g., THC:5,CBD:10)"
              name="dosage"
              value={batch.dosage}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Add Batch
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddBatch;
