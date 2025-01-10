import React, { useState, useEffect } from "react";
import { ref, get, push, update } from "firebase/database";
import { database } from "../config/firebase";
import { auth } from "../config/firebase"; // Import auth from Firebase
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";

const AddBatch = () => {
  const [batch, setBatch] = useState({
    recipeName: "",
    quantity: "",
    date: "", // Will autofill to today's date
    dosage: [], // Will store the dosage (oil type and milligrams)
    employeeId: "", // New field for employeeId
    orderName: "", // New field for orderName
  });
  const [recipes, setRecipes] = useState([]); // HOLDS RECIPE DATA FETCHED FROM FIREBASE
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null); // HOLDS THE CURRENTLY LOGGED-IN USER

  const oilOptions = ["D9", "D8", "FS", "D9/CBD", "D8/CBD"];
  const milligramOptions = [
    10, 15, 20, 25, 30, 35, 40, 50, 100, 150, 200, 250, 400,
  ];

  useEffect(() => {
    // AUTOFILL TODAY'S DATE
    const today = new Date().toISOString().split("T")[0]; // FORMAT AS YYYY-MM-DD
    setBatch((prev) => ({ ...prev, date: today }));

    // LISTEN FOR CHANGES IN AUTHENTICATION STATE
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // SET THE USER STATE WITH THE CURRENT USER OBJECT
        setBatch((prev) => ({
          ...prev,
          employeeId: user.uid, // AUTOMATICALLY FILL EMPLOYEEID WITH THE USER'S UID
        }));
      } else {
        setUser(null);
      }
    });

    // CLEANUP THE SUBSCRIPTION WHEN THE COMPONENT UNMOUNTS
    return () => unsubscribe();
  }, []);

  // FETCH RECIPES FROM FIREBASE
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const dbRef = ref(database, "recipes"); // REFERENCE THE RECIPES NODE IN FIREBASE
        const snapshot = await get(dbRef); // GET DATA SNAPSHOT FROM FIREBASE

        if (snapshot.exists()) {
          const recipeData = snapshot.val(); // RETRIEVE THE DATA OBJECT

          // TRANSFORM RECIPE DATA INTO AN ARRAY OF OBJECTS
          const recipeList = Object.keys(recipeData).map((key) => ({
            id: key, // FIREBASE AUTO-GENERATED ID
            ...recipeData[key], // SPREAD ALL FIELDS (NAME, DATE, DESCRIPTION, ETC.)
            date: recipeData[key].date
              ? new Date(recipeData[key].date).toISOString().split("T")[0] // FORMAT DATE AS YYYY-MM-DD
              : "", // SET EMPTY STRING IF DATE IS MISSING
            dosage: recipeData[key].dosage
              ? Object.keys(recipeData[key].dosage).map((doseKey) => ({
                  key: doseKey, // FIREBASE GENERATED KEY FOR EACH DOSAGE
                  ...recipeData[key].dosage[doseKey], // SPREAD DOSAGE PROPERTIES (CANNABINOID, MG, ETC.)
                }))
              : [], // IF NO DOSAGE EXISTS, SET AS EMPTY ARRAY
          }));

          setRecipes(recipeList); // STORE THE TRANSFORMED RECIPE LIST IN STATE
        } else {
          setError("No recipes found."); // HANDLE CASE WHERE NO RECIPES EXIST
        }
      } catch (err) {
        setError("Failed to fetch recipes: " + err.message); // HANDLE ANY ERRORS DURING FETCH
      }
    };

    fetchRecipes(); // CALL THE FUNCTION WHEN THE COMPONENT MOUNTS
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // IF THE RECIPE NAME DROPDOWN IS CHANGED
    if (name === "recipeName") {
      // FIND THE SELECTED RECIPE BASED ON THE ID
      const selectedRecipe = recipes.find((recipe) => recipe.id === value);
      setBatch((prev) => ({
        ...prev,
        recipeName: selectedRecipe ? selectedRecipe.name : "", // STORE THE NAME FOR DISPLAY
        recipeId: selectedRecipe ? selectedRecipe.id : "", // STORE THE ID FOR SUBMISSION
      }));
    } else {
      // UPDATE OTHER FIELDS AS USUAL
      setBatch((prev) => ({ ...prev, [name]: value }));
    }
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
      const dbRef = ref(database, "batches");
      const newBatchRef = await push(dbRef); // PUSH THE MAIN BATCH AND GET ITS UNIQUE KEY

      // PATCH THE BATCH FIELDS FIRST (EXCLUDING DOSAGE)
      const batchWithoutDosage = { ...batch };
      delete batchWithoutDosage.dosage; // REMOVE DOSAGE TO SAVE IT SEPARATELY
      delete batchWithoutDosage.recipeName; // REMOVE recipeName TO AVOID DUPLICATES
      await update(newBatchRef, batchWithoutDosage); // UPDATE THE BATCH FIELDS

      // STORE EACH DOSAGE UNDER THE `dosage` FIELD OF THE NEW BATCH
      const dosagesRef = ref(database, `batches/${newBatchRef.key}/dosage`);
      const dosagePromises = batch.dosage.map((dose) => push(dosagesRef, dose));
      await Promise.all(dosagePromises);

      setSuccess(true);
      setBatch({
        recipeName: "",
        recipeId: "",
        quantity: "",
        date: "",
        dosage: [],
        employeeId: "",
        orderName: "",
      });
    } catch (err) {
      setError("Failed to add batch: " + err.message);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "auto",
        marginTop: "20px",
        padding: "16px",
        color: "lightslategray", // Standardize font color for all text
        "& .MuiFormLabel-root": {
          color: "#FF007F", // Label color
        },
        "& .MuiInputBase-root": {
          color: "#FF007F", // Input text color
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "gray", // Outline color
        },
        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "black", // Hover border color
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
          {
            borderColor: "black", // Focused border color
          },
        "& .MuiSelect-select": {
          color: "#FF007F", // Select dropdown text color
        },
        "& .MuiMenuItem-root": {
          color: "lightslategray", // Dropdown menu item color
        },
        "& .MuiMenuItem-root:hover": {
          backgroundColor: "lightgray", // Dropdown menu hover background
        },
      }}
    >
      <Typography
        variant="h5"
        textAlign="center"
        gutterBottom
        color={"#FF007F"}
      >
        Add a New Batch
      </Typography>
      {success && <Alert severity="success">Batch added successfully!</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel id="recipe-name-label">Recipe Name</InputLabel>
              <Select
                labelId="recipe-name-label"
                name="recipeName"
                value={batch.recipeId}
                onChange={handleChange}
                label="Recipe Name"
              >
                {recipes.map((recipe) => (
                  <MenuItem key={recipe.id} value={recipe.id}>
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
          <Grid item xs={12} sx={{ display: "none" }}>
            <TextField
              fullWidth
              label="Employee ID"
              name="employeeId"
              value={batch.employeeId || ""}
              onChange={handleChange}
              hidden
              disabled
              sx={{
                display: "none",
                "& .MuiInputBase-root.Mui-disabled": {
                  color: "lightslategray", // Disabled input text color
                },
                "& .MuiFormLabel-root.Mui-disabled": {
                  color: "lightslategray", // Disabled label text color
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Order Name"
              name="orderName"
              value={batch.orderName}
              onChange={handleChange}
              required
            />
          </Grid>

          {batch.dosage.map((dose, index) => (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginLeft: "55px",
                marginTop: "16px",
              }}
            >
              <Grid container spacing={2} key={index} sx={{ maxWidth: "100%" }}>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth required>
                    <InputLabel id={`dosage-oil-label-${index}`}>
                      Cannabinoid
                    </InputLabel>
                    <Select
                      labelId={`dosage-oil-label-${index}`}
                      name="cannabinoid"
                      value={dose.cannabinoid}
                      onChange={(e) =>
                        handleDosageChange(index, "cannabinoid", e.target.value)
                      }
                      label="Cannabinoid"
                      MenuProps={{
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left", // Align dropdown with the left edge
                        },
                        transformOrigin: {
                          vertical: "top",
                          horizontal: "left", // Grow from the left edge
                        },
                        PaperProps: {
                          sx: {
                            maxWidth: "100%", // Limit dropdown width to the screen width
                            left: "0 !important", // Reset dropdown position
                            overflowX: "auto", // Allow scrolling if content overflows horizontally
                            zIndex: 1302, // Ensure the dropdown is above other elements
                          },
                        },
                      }}
                    >
                      {oilOptions.map((oil) => (
                        <MenuItem key={oil} value={oil}>
                          {oil}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth required>
                    <InputLabel id={`dosage-mg-label-${index}`}>
                      Milligrams
                    </InputLabel>
                    <Select
                      labelId={`dosage-mg-label-${index}`}
                      name="mg"
                      value={dose.mg}
                      onChange={(e) =>
                        handleDosageChange(index, "mg", e.target.value)
                      }
                      label="Milligrams"
                      MenuProps={{
                        sx: {
                          "& .MuiPaper-root": {
                            maxWidth: "calc(100vw - 32px)", // Prevent dropdown from exceeding screen width
                            overflowX: "auto", // Allow horizontal scroll if needed
                          },
                        },
                      }}
                    >
                      {milligramOptions.map((mg) => (
                        <MenuItem key={mg} value={mg}>
                          {mg} mg
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Box>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveDosage(index)}
                      sx={{ height: "100%", left: "50px" }}
                    >
                      Remove
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ))}
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
                }}
              >
                Add Dosage
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                //backgroundColor: "#11d272",
                backgroundColor: "#bf08bb",
              }}
            >
              Submit Batch
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddBatch;
