import React from "react";
import { Box, Typography } from "@mui/material";
import DrippyLeaf from "../assets/weed-leaf-drip-trans-areas.png";
const HomePage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: "100vh", // Ensure it spans the full height of the viewport
        padding: "16px",
        backgroundColor: "#121212", // Optional background color
        textAlign: "center",
        gap: "16px", // Add spacing between SVG and text
      }}
    >
      {/* Centered SVG */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "300px", // Restrict maximum size on larger screens
          aspectRatio: "1/1", // Keep the SVG square
          marginTop: "32px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img alt="a marijuana leaf dripping" src={DrippyLeaf} />
      </Box>
      {/* Description */}
      <Typography
        variant="h6"
        sx={{
          color: "#FFFFFF",
          maxWidth: "90%", // Keep the text width constrained on mobile
          margin: "0 auto", // Center the text
          fontSize: { xs: "16px", sm: "18px", md: "20px" }, // Responsive font sizes
        }}
      >
        Welcome to Wake-N-Bake! <br></br>Here you can calculate dosages and
        record what you've made!
      </Typography>
    </Box>
  );
};

export default HomePage;
