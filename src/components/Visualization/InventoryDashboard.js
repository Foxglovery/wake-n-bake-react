import React from "react";
import InventoryGraph from "./InventoryGraph";
import { Box, Typography } from "@mui/material";

const InventoryDashboard = () => {
  // This must === Sheet Category column. Add to array as list grows
  const categories = ["Cookie", "Mallow", "Gummies"];

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        maxWidth: { xs: "90%", sm: "80%", md: "60%" }, // Responsive max width
        margin: "auto", // Center the text box
        textAlign: "center", // Ensure text is centered
        gap: 1,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "#FF007F",
          wordWrap: "break-word", // Ensure text wraps properly
          marginTop: "20px",
        }}
      ></Typography>
      <Typography
        variant="h7"
        gutterBottom
        sx={{
          fontSize: { sm: "24px", md: "24px" },
          color: "#FF007F",
          wordWrap: "break-word", // Ensure text wraps properly
        }}
      >
        When the blue line dips near the red dashed line, it is time to bake
        more!
      </Typography>
      {categories.map((category) => (
        <div key={category}>
          <h2>{category}</h2>
          <InventoryGraph category={category} />
        </div>
      ))}
    </Box>
  );
};

export default InventoryDashboard;
