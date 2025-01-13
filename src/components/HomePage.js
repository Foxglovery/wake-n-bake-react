import React from "react";
import { Box, Typography } from "@mui/material";
import FoxSwirlIcon from "../components/IconService/FoxSwirlIcon";

const HomePage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // Full viewport height
        textAlign: "center",
        padding: "16px",
        backgroundColor: "#121212", // Optional background color
      }}
    >
      {/* Centered SVG */}
      <Box
        sx={{
          width: "200px", // Adjust width as needed
          height: "auto",
          marginBottom: "16px",
        }}
      >
        <FoxSwirlIcon /> {/* Render your SVG component */}
      </Box>

      {/* Description */}
      <Typography
        variant="h6"
        sx={{
          color: "#FFFFFF", // Adjust text color as needed
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        Welcome to our app! This platform allows you to manage your batches,
        calculate dosages, and keep track of all your recipes effortlessly. Our
        intuitive interface ensures you can focus on what matters most—
        delivering excellence in every batch.
      </Typography>
    </Box>
  );
};

export default HomePage;
