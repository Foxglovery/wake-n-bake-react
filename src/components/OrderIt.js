import { Box, Typography } from "@mui/material";
import React from "react";

function OrderIt() {
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
        Ask And Ye Shall Receive
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
        Enter anything you need and it will be handled. Part of this deal is
        that upon receipt you shall return and remove your request.
      </Typography>

      {/* Map through categories */}
    </Box>
  );
}

export default OrderIt;
