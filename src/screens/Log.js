import React, { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { database } from "../config/firebase";
import {
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
} from "@mui/material";

const RecipeFetcher = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const dbRef = ref(database, "batches");
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
          setRecipes(Object.values(snapshot.val()));
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
      justifyContent="center"
      sx={{
        padding: { xs: "10px", sm: "20px" },
        margin: "0 auto",
        maxWidth: "100%",
      }}
    >
      {recipes.map((recipe, index) => (
        <Grid
          item
          xs={12} // Full width on small screens
          sm={6} // Two cards per row on small screens
          md={4} // Three cards per row on medium and larger screens
          key={index}
          sx={{
            padding: "8px",
            display: "flex",
            justifyContent: "center", // Ensure it stays centered in the grid
          }}
        >
          <Card sx={{ maxWidth: 345, height: "100%", position: "relative" }}>
            {/* Badge for dosage */}
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "red",
                color: "white",
                padding: "4px 8px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "bold",
                zIndex: 1,
              }}
            >
              {Object.entries(recipe.dosage).map(([key, dose], index) => (
                <div key={index}>
                  {dose.cannabinoid}: {dose.mg}mg
                </div>
              ))}
            </Box>

            <CardContent>
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{
                  textAlign: "center",
                  marginBottom: 2,
                  marginTop: 1,
                  fontWeight: "bold",
                }}
              >
                {recipe.recipeName}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Quantity: {recipe.quantity}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  Date: {recipe.date}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default RecipeFetcher;
