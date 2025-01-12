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
  FormGroup,
  FormControlLabel,
  Checkbox,
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

  const [isRetail, setIsRetail] = useState(false);
  const oilOptions = ["D9", "D8", "FS", "D9/CBD", "D8/CBD"];
  const milligramOptions = [
    10, 15, 20, 25, 30, 35, 40, 50, 100, 150, 200, 250, 400,
  ];

  useEffect(() => {
    // Autofill today's date
    const today = new Date().toISOString().split("T")[0];
    setBatch((prev) => ({ ...prev, date: today }));

    // Listen for changes in authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setBatch((prev) => ({
          ...prev,
          employeeId: user.uid, // Automatically fill employeeId
        }));
      }
    });

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

    if (name === "recipeName") {
      const selectedRecipe = recipes.find((recipe) => recipe.id === value);
      setBatch((prev) => ({
        ...prev,
        recipeName: selectedRecipe ? selectedRecipe.name : "Unnamed Recipe", // Fallback to a default name
        recipeId: value,
      }));
    } else {
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

      // PATCH THE BATCH FIELDS (INCLUDING recipeName)
      const batchWithoutDosage = { ...batch };
      delete batchWithoutDosage.dosage; // REMOVE DOSAGE TO SAVE IT SEPARATELY
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
        color: "lightslategray",
        height: "100vh", // Full screen height
        overflow: "auto", // Allow scrolling when content overflows
        boxSizing: "border-box", // Include padding in height calculation
        "& .MuiFormLabel-root": {
          color: "#FF007F", // Label color
        },
        "& .MuiInputBase-root": {
          color: "#FF007F", // Input text color
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "#FF007F", // Default border color
          },
          "& .MuiInputBase-input::placeholder": {
            color: "#FF007F", // Change placeholder color
            opacity: 1, // Ensure the opacity is visible (can be adjusted)
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#bf08bb",
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
          "&:hover fieldset": {
            borderColor: "#bf08bb", // Hover border color
          },
          "&.Mui-focused fieldset": {
            borderColor: "#bf08bb", // Focused border color
          },
          "& .MuiInputBase-input": {
            color: "#FF007F", // Input text color
          },
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
                value={batch.recipeId || ""} // Default to empty string
                onChange={handleChange}
                label="Recipe Name"
                sx={{
                  "& .MuiInputLabel-root": { color: "#FF007F" },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#bf08bb",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "white",
                    opacity: 1,
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#FF007F",
                    },
                    "&:hover fieldset": {
                      borderColor: "#11d272",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#11d272",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "white",
                  },
                }}
              >
                <MenuItem value="">Select a recipe</MenuItem>{" "}
                {/* Default placeholder */}
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
              sx={{
                "& .MuiInputLabel-root": { color: "#FF007F" }, // Label color
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#11d272",
                },
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
                "&:hover fieldset": {
                  borderColor: "#bf08bb", // Hover border color
                },
              }}
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
              InputLabelProps={{
                shrink: true,
                sx: {
                  color: "#FF007F", // Default label color
                  "&.Mui-focused": {
                    color: "#bf08bb", // Focused label color
                  },
                },
              }}
              sx={{
                "& .MuiInputBase-input": {
                  color: "#FF007F", // Input text color
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
              }}
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
                      setBatch((prev) => ({
                        ...prev,
                        orderName: e.target.checked ? "Retail" : "",
                      }));
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
                label="Retail Order"
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
                "& .MuiInputLabel-root": { color: "#FF007F" }, // Label color
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#11d272",
                },
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
                "&:hover fieldset": {
                  borderColor: "#11d272", // Hover border color
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box
              display={"flex"}
              justifyContent={"center"}
              sx={{
                gap: "16px", // Add spacing between elements
                flexWrap: "wrap",
              }}
            >
              {batch.dosage.map((dose, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px", // Add smaller gap between dropdowns
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "8px", // Small gap between Cannabinoid and Milligrams
                      flexWrap: "wrap",
                      minWidth: "250px",
                    }}
                  >
                    {/* Cannabinoid Select */}
                    <FormControl fullWidth required>
                      <InputLabel
                        id={`dosage-oil-label-${index}`}
                        sx={{
                          color: "#FF007F", // Default label color
                          "&.Mui-focused": {
                            color: "#11d272", // Label color on focus
                          },
                        }}
                      >
                        Cannabinoid
                      </InputLabel>
                      <Select
                        labelId={`dosage-oil-label-${index}`}
                        name="cannabinoid"
                        value={dose.cannabinoid}
                        onChange={(e) =>
                          handleDosageChange(
                            index,
                            "cannabinoid",
                            e.target.value
                          )
                        }
                        label="Cannabinoid"
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#FF007F", // Default border color
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#11d272", // Hover border color
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#11d272", // Border color on focus
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

                    {/* MG Select */}
                    <FormControl fullWidth required>
                      <InputLabel
                        id={`dosage-mg-label-${index}`}
                        sx={{
                          color: "#FF007F", // Default label color
                          "&.Mui-focused": {
                            color: "#11d272", // Label color on focus
                          },
                        }}
                      >
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
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#FF007F", // Default border color
                            },
                            "&:hover fieldset": {
                              borderColor: "#11d272", // Hover border color
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#11d272", // Border color on focus
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
                  </Box>

                  {/* Remove Dosage Button */}
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
