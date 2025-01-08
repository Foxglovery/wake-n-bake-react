import React, { useState } from "react";
import { ref, push, set } from "firebase/database";
import { database } from "../config/firebase";
import { TextField, Button, Box, Typography } from "@mui/material";

const RecipeForm = () => {
  const [recipeName, setRecipeName] = useState("");

  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form data
    if (!recipeName) {
      setError("Please fill in all fields.");
      return;
    }

    // Create the recipe object
    const newRecipe = {
      name: recipeName,
    };

    try {
      // Push the new recipe to Firebase
      const recipesRef = ref(database, "recipes");
      const newRecipeRef = push(recipesRef); // Generate unique ID for the recipe
      await set(newRecipeRef, newRecipe); // Set the recipe data
      setRecipeName(""); // Clear input fields
      setError(null); // Reset error
      alert("Recipe added successfully!");
    } catch (error) {
      console.error("Error adding recipe:", error);
      setError("Failed to add recipe. Please try again.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 400,
        margin: "auto",
        padding: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Add New Recipe
      </Typography>

      {/* Recipe Name */}
      <TextField
        label="Recipe Name"
        value={recipeName}
        onChange={(e) => setRecipeName(e.target.value)}
        fullWidth
        required
      />

      {/* Error message */}
      {error && <Typography color="error">{error}</Typography>}

      {/* Submit Button */}
      <Button type="submit" variant="contained" color="primary">
        Submit Recipe
      </Button>
    </Box>
  );
};

export default RecipeForm;
