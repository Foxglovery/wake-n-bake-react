import React, { useState } from "react";
import { Box, TextField, Typography, Grid } from "@mui/material";
import tentacledBaker from "../assets/tentacle-baker.png";
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
        position: "relative", // Ensure the pseudo-element is positioned correctly
        maxWidth: "500px",
        margin: "auto",
        marginTop: "20px",
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        //backgroundColor: "rgba(0, 0, 0, 0.7)", // Card background
        borderRadius: "8px",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
        color: "white",
        overflow: "hidden", // Prevent the pseudo-element from spilling out
        zIndex: 1, // Ensure the content is above the background
        "::before": {
          content: '""', // Required for pseudo-elements
          position: "absolute",
          top: 20,
          left: 0,
          right: 15,
          bottom: 0,
          backgroundImage: `url(${tentacledBaker})`, // Background image
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.2, // Adjust the opacity of the background image
          zIndex: -1, // Place it behind the card content
        },
      }}
    >
      <Typography
        variant="h4"
        textAlign="center"
        gutterBottom
        sx={{ color: "#FF007F" }}
      >
        Dosage Calculator
      </Typography>
      <Typography
        variant="h7"
        textAlign="center"
        gutterBottom
        sx={{ color: "#FF007F" }}
      >
        Consult the eldritch baker to reveal how many units of the good stuff
        you will need.
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
            sx={{
              "& .MuiInputLabel-root": { color: "#FF007F" }, // Label color
              // "& .MuiInputLabel-root.Mui-focused": {
              //   color: "#bf08bb",
              // },
              "& .MuiInputBase-input::placeholder": {
                color: "white", // Change placeholder color
                opacity: 1, // Ensure the opacity is visible (can be adjusted)
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#FF007F", // Default border color
                },
                "&:hover fieldset": {
                  borderColor: "#bf08bb", // Hover border color
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#bf08bb", // Focused border color
                },
              },
              "& .MuiInputBase-input": {
                color: "white", // Input text color
              },
            }}
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
            sx={{
              "& .MuiInputLabel-root": { color: "#FF007F" }, // Label color
              // "& .MuiInputLabel-root.Mui-focused": {
              //   color: "#11d272",
              // },
              "& .MuiInputBase-input::placeholder": {
                color: "white", // Change placeholder color
                opacity: 1, // Ensure the opacity is visible (can be adjusted)
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#FF007F", // Default border color
                },
                "&:hover fieldset": {
                  borderColor: "#11d272", // Hover border color
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#11d272", // Focused border color
                },
              },
              "& .MuiInputBase-input": {
                color: "white", // Input text color
              },
            }}
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
            sx={{
              "& .MuiInputLabel-root": { color: "#FF007F" }, // Label color
              // "& .MuiInputLabel-root.Mui-focused": {
              //   color: "#bf08bb",
              // },
              "& .MuiInputBase-input::placeholder": {
                color: "white", // Change placeholder color
                opacity: 1, // Ensure the opacity is visible (can be adjusted)
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#FF007F", // Default border color
                },
                "&:hover fieldset": {
                  borderColor: "#bf08bb", // Hover border color
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#bf08bb", // Focused border color
                },
              },
              "& .MuiInputBase-input": {
                color: "white", // Input text color
              },
            }}
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
            sx={{
              "& .MuiInputLabel-root": { color: "#FF007F" }, // Label color
              // "& .MuiInputLabel-root.Mui-focused": {
              //   color: "#11d272",
              // },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#FF007F", // Default border color
                  color: "white",
                },
                "&:hover fieldset": {
                  borderColor: "#11d272", // Hover border color
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#11d272", // Focused border color
                },
              },
              "& .MuiInputBase-input": {
                color: "white", // Input text color
              },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DosageCalculator;
