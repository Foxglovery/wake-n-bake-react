import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { ref, get, update, push, remove } from "firebase/database";

import { database } from "../config/firebase";

export default function BatchCard() {
  const { id } = useParams(); // Extract batch ID from URL
  const [batch, setBatch] = useState({
    recipeName: "",
    quantity: "",
    date: "",
    dosage: [], // Array of dosage entries
    orderName: "",
  });
  const [recipes, setRecipes] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isRetail, setIsRetail] = useState(batch.orderName === "Retail");
  const [isBackstock, setIsBackstock] = useState(
    batch.orderName === "Backstock"
  );
  const oilOptions = ["D9", "D8", "FS", "D9/CBD", "D8/CBD"];
  const milligramOptions = [
    10, 15, 20, 25, 30, 35, 40, 50, 100, 150, 200, 250, 400,
  ];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const batchRef = ref(database, `batches/${id}`);
        const batchSnapshot = await get(batchRef);

        if (batchSnapshot.exists()) {
          const data = batchSnapshot.val();

          // Transform dosage from object to array
          const dosageArray = data.dosage
            ? Object.keys(data.dosage).map((key) => ({
                id: key, // Include the Firebase key as an ID
                ...data.dosage[key],
              }))
            : [];

          setBatch({
            ...data,
            dosage: dosageArray, // Replace dosage object with an array
          });
          setIsRetail(data.orderName === "Retail");
          setIsBackstock(data.orderName === "Backstock");
        } else {
          setError("Batch not found.");
        }

        // Fetch recipes
        const recipesRef = ref(database, "recipes");
        const recipesSnapshot = await get(recipesRef);
        if (recipesSnapshot.exists()) {
          const recipeList = Object.keys(recipesSnapshot.val()).map((key) => ({
            id: key,
            name: recipesSnapshot.val()[key].name || "Unnamed Recipe",
          }));
          setRecipes(recipeList);
        } else {
          setError((prev) => `${prev}\nNo recipes found.`);
        }
      } catch (err) {
        setError("Failed to fetch data: " + err.message);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBatch((prev) => ({ ...prev, [name]: value }));
  };

  const handleDosageChange = (index, field, value) => {
    const updatedDosages = [...batch.dosage];
    updatedDosages[index] = { ...updatedDosages[index], [field]: value };
    setBatch((prev) => ({ ...prev, dosage: updatedDosages }));
  };

  const handleAddDosage = () => {
    setBatch((prev) => ({
      ...prev,
      dosage: [...prev.dosage, { cannabinoid: "", mg: "" }],
    }));
  };

  const handleRemoveDosage = (index) => {
    const updatedDosages = batch.dosage.filter((_, i) => i !== index);
    setBatch((prev) => ({ ...prev, dosage: updatedDosages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError("");

    try {
      const batchRef = ref(database, `batches/${id}`);
      const { dosage, ...batchWithoutDosage } = batch;

      // Transform dosage array back into an object with unique keys
      const dosageObject = dosage.reduce((acc, dose) => {
        const key = dose.id || push(ref(database)).key; // Generate unique key
        acc[key] = {
          cannabinoid: dose.cannabinoid,
          mg: dose.mg,
        };
        return acc;
      }, {});

      // Log the data for debugging
      console.log("Updating batch with data:", {
        ...batchWithoutDosage,
        dosage: dosageObject,
      });

      // Update the batch in Firebase
      await update(batchRef, {
        ...batchWithoutDosage,
        dosage: dosageObject,
      });

      setSuccess(true);

      setTimeout(() => {
        navigate("/findIt");
      }, 3000);
    } catch (err) {
      console.error("Error updating batch:", err); // Log the error for debugging
      setError("Failed to update batch: " + err.message);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this batch?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const batchRef = ref(database, `batches/${id}`);
      await remove(batchRef);

      setSuccess(true);
      setTimeout(() => {
        navigate("/findIt");
      }, 3000);
    } catch (err) {
      setError("Failed to delete batch: " + err.message);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "auto",
        marginTop: "20px",
        padding: "16px",
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Typography
        variant="h5"
        textAlign="center"
        gutterBottom
        color={"#FF007F"}
      >
        Edit Batch
      </Typography>
      {success && (
        <Typography
          color="success"
          sx={{
            marginBottom: "5px",
          }}
        >
          Batch updated successfully!
        </Typography>
      )}
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Recipe Name</InputLabel>
              <Select
                name="recipeName"
                value={batch.recipeName || ""}
                onChange={handleChange}
              >
                {recipes.map((recipe) => (
                  <MenuItem key={recipe.id} value={recipe.name}>
                    {recipe.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              type="number"
              value={batch.quantity || ""}
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
              value={batch.date || ""}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sx={{ display: "none" }}>
            <TextField
              fullWidth
              label="Employee ID"
              name="employeeId"
              value={batch.employeeId || ""}
              onChange={handleChange}
              disabled
              hidden
            />
          </Grid>

          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <FormGroup>
              <FormControlLabel
                sx={{
                  color: isRetail ? "#11d272" : "#FF007F",
                }}
                control={
                  <Checkbox
                    checked={isRetail}
                    onChange={(e) => {
                      setIsRetail(e.target.checked);
                      if (e.target.checked) {
                        setIsBackstock(false); // Uncheck Backstock if Retail is selected
                        setBatch((prev) => ({
                          ...prev,
                          orderName: "Retail",
                        }));
                      } else {
                        setBatch((prev) => ({
                          ...prev,
                          orderName: "",
                        }));
                      }
                    }}
                    sx={{
                      color: "#FF007F",
                      "& .MuiSvgIcon-root": { fontSize: 28 },
                      "&.Mui-checked": {
                        color: "#11d272",
                      },
                    }}
                  />
                }
                label="Retail"
              />
            </FormGroup>
            <FormGroup>
              <FormControlLabel
                sx={{
                  color: isBackstock ? "#11d272" : "#FF007F",
                }}
                control={
                  <Checkbox
                    checked={isBackstock}
                    onChange={(e) => {
                      setIsBackstock(e.target.checked);
                      if (e.target.checked) {
                        setIsRetail(false); // Uncheck Retail if Backstock is selected
                        setBatch((prev) => ({
                          ...prev,
                          orderName: "Backstock",
                        }));
                      } else {
                        setBatch((prev) => ({
                          ...prev,
                          orderName: "",
                        }));
                      }
                    }}
                    sx={{
                      color: "#FF007F",
                      "& .MuiSvgIcon-root": { fontSize: 28 },
                      "&.Mui-checked": {
                        color: "#11d272",
                      },
                    }}
                  />
                }
                label="Backstock"
              />
            </FormGroup>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Order Name"
              name="orderName"
              value={batch.orderName}
              onChange={handleChange}
              required
              sx={{
                // Label styles
                "& .MuiInputLabel-root": {
                  color: "#FF007F", // Default Label color
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#FF007F", // Focused label color
                },

                // Placeholder styles
                "& .MuiInputBase-input::placeholder": {
                  color: "#FF007F", // Placeholder color
                  opacity: 1,
                },

                // Typed text styles
                "& .MuiInputBase-input": {
                  color: "white", // Input text color
                },

                // Outlined input styles
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#bf08bb", // Default border color
                  },
                  "&:hover fieldset": {
                    borderColor: "#11d272", // Hover border color
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#11d272", // Focused border color
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" flexDirection="column" gap="16px">
              {batch.dosage.map((dose, index) => (
                <Box
                  key={index}
                  display="flex"
                  flexDirection="row"
                  gap="16px"
                  alignItems="center"
                >
                  <FormControl fullWidth required>
                    <InputLabel>Cannabinoid</InputLabel>
                    <Select
                      value={dose.cannabinoid}
                      onChange={(e) =>
                        handleDosageChange(index, "cannabinoid", e.target.value)
                      }
                    >
                      {oilOptions.map((oil) => (
                        <MenuItem key={oil} value={oil}>
                          {oil}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth required>
                    <InputLabel>Milligrams</InputLabel>
                    <Select
                      value={dose.mg}
                      onChange={(e) =>
                        handleDosageChange(index, "mg", e.target.value)
                      }
                    >
                      {milligramOptions.map((mg) => (
                        <MenuItem key={mg} value={mg}>
                          {mg} mg
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemoveDosage(index)}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display={"flex"} justifyContent={"center"}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddDosage}
                sx={{
                  marginTop: 2,
                  //backgroundColor: "#bf08bb",
                  backgroundColor: "#11d272",
                  "&:hover": {
                    backgroundColor: "#0eae5e",
                  },
                }}
              >
                Add Dosage
              </Button>
            </Box>
          </Grid>
          {/* <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddDosage}
              fullWidth
            >
              Add Dosage
            </Button>
          </Grid> */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Save Batch
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={handleDelete}
              sx={{ marginTop: 2 }}
            >
              Delete Batch
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
