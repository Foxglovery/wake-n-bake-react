import React, { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { database } from "../config/firebase";
import {
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";

const RecipeFetcher = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from Firebase Realtime Database
    const fetchRecipes = async () => {
      try {
        const dbRef = ref(database, "batches"); // Adjust the path to your data
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
          setRecipes(Object.values(snapshot.val())); // Convert the snapshot to an array
        } else {
          setError("No data available");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Typography color="error">{`Error: ${error}`}</Typography>
      </div>
    );
  }

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center" // Center the cards horizontally
      alignItems="stretch" // Ensure cards have equal height
      style={{ marginTop: "20px" }}
    >
      {recipes.map((recipe, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card sx={{ maxWidth: 345, height: "100%" }}>
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {recipe.recipeName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quantity: {recipe.quantity}
              </Typography>
              <Typography variant="body2" color="text.primary">
                Date: {recipe.date}
              </Typography>
              <Typography variant="body2" color="text.primary">
                Dosage:
                <ul>
                  {Object.entries(recipe.dosage).map(([key, dose], index) => (
                    <li key={index}>
                      {key}: {dose.cannabinoid} - {dose.mg}mg
                    </li>
                  ))}
                </ul>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default RecipeFetcher;
