import React, { useState } from "react";
import { Box, TextField, Typography, Grid } from "@mui/material";

const DosageCalculator = () => {
  const [numEdibles, setNumEdibles] = useState("");
  const [concentration, setConcentration] = useState("");
  const [desiredDosage, setDesiredDosage] = useState("");
  const [oilNeeded, setOilNeeded] = useState("");

  // Calculate the total oil needed
  const calculateOilNeeded = () => {
    if (numEdibles && concentration && desiredDosage) {
      const oilConcentrationDecimal = parseFloat(concentration) / 100;
      const totalOil =
        (desiredDosage * numEdibles) / (oilConcentrationDecimal * 100);
      setOilNeeded(totalOil.toFixed(2)); // Round to 2 decimal places
    } else {
      setOilNeeded(""); // Clear the output if inputs are missing
    }
  };

  // Handle input changes and trigger calculation
  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
    calculateOilNeeded();
  };

  return (
    <Box
      sx={{
        maxWidth: "500px",
        margin: "auto",
        marginTop: "20px",
        padding: "16px",
        backgroundColor: "black",
        borderRadius: "8px",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Typography variant="h5" textAlign="center" gutterBottom>
        Dosage Calculator
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Number of Edibles"
            type="number"
            value={numEdibles}
            onChange={handleInputChange(setNumEdibles)}
            variant="outlined"
            placeholder="Enter number of edibles"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Oil Concentration (%)"
            type="number"
            value={concentration}
            onChange={handleInputChange(setConcentration)}
            variant="outlined"
            placeholder="Enter oil concentration (e.g., 50)"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Desired Dosage (mg)"
            type="number"
            value={desiredDosage}
            onChange={handleInputChange(setDesiredDosage)}
            variant="outlined"
            placeholder="Enter desired dosage per edible"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Oil Needed (mL)"
            type="text"
            value={oilNeeded}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            placeholder="Calculated oil needed will appear here"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DosageCalculator;
