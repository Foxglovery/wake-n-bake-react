import React from "react";
import InventoryGraph from "./InventoryGraph";
import { Box, Typography } from "@mui/material";

const InventoryDashboard = () => {
  // This must === Sheet Category column. Add to array as list grows
  const categories = ["Cookie", "Mallow", "Gummy"];

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        maxWidth: { xs: "90%", sm: "80%", md: "60%" },
        margin: "auto",
        textAlign: "center",
        gap: 4, // Adds spacing between sections
        paddingBottom: "40px", // Adds space at the bottom of the dashboard
      }}
    >
      {/* Main Heading */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "#FF007F",
          marginTop: "20px",
          wordWrap: "break-word",
        }}
      >
        Bakery Inventory
      </Typography>
      <Typography
        variant="body1"
        gutterBottom
        sx={{
          fontSize: { xs: "16px", md: "18px" },
          color: "#FF007F",
          wordWrap: "break-word",
        }}
      >
        When the blue line dips near the red dashed line, it is time to bake
        more! Use this dashboard to monitor your inventory levels across
        categories.
      </Typography>

      {/* Map through categories */}
      {categories.map((category) => (
        <Box
          key={category}
          sx={{
            marginBottom: "40px", // Space between each graph
          }}
        >
          {/* Category Title */}
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: "#FF007F",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            {category} Inventory
          </Typography>

          {/* Render Graph */}
          <InventoryGraph category={category} />
        </Box>
      ))}
    </Box>
  );
};

export default InventoryDashboard;
