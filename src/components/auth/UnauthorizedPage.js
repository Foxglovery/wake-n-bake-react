import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";
import king from "../../assets/king-in-yellow.png";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh" // Full height of the viewport
      px={2} // Add horizontal padding for mobile screens
      sx={{
        maxWidth: "100%", // Prevent content from overflowing screen width
        //width: { xs: "100%", sm: "80%", md: "60%" }, // Adjust width based on screen size
        textAlign: "center", // Center align all text
        margin: "0 auto", // Center the box on the screen
        paddingTop: "40px", // Space between the top and the content
        background:
          "radial-gradient(circle, rgba(177,181,199,1) 2%, rgba(144,149,171,1) 17%, rgba(131,134,144,1) 26%, rgba(69,71,76,1) 56%, rgba(31,32,34,1) 82%, rgba(0,0,0,1) 100%)",
        backgroundSize: "cover",
      }}
    >
      {/* Image Section */}
      <Box>
        <img
          src={king}
          alt="King in Yellow"
          style={{
            width: "180px", // Adjust image size
            height: "auto",
            marginBottom: "0px", // Add space below the image
          }}
        />
      </Box>

      {/* Access Denied Text */}
      <Typography
        variant="h4"
        color="error"
        gutterBottom
        sx={{
          textShadow: "rgb(0, 0, 0) 3px 2px 3px",
        }}
      >
        Access Denied
      </Typography>
      <Typography
        variant="body1"
        gutterBottom
        sx={{
          fontSize: { xs: "14px", md: "24px" },
          color: "rgba(255, 255, 255, 0.88)",

          textShadow: "rgb(0, 0, 0) 3px 2px 3px",
        }}
      >
        You do not have permission to view this page.<br></br> You may try
        registering and if the Cannabis Cabal deems you worthy, you may be
        accepted. <br></br>Otherwise, please return from whence you came.
      </Typography>

      {/* Buttons */}
      <Box
        display={"flex"}
        flexDirection={{ xs: "column", sm: "row" }} // Stack buttons vertically on small screens
        gap={2}
        sx={{ marginTop: "10px" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          sx={{
            backgroundColor: "black",
            color: "white",
          }}
        >
          If You Lived Here, You'd Be (Home) Already
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate("/login")}
          sx={{
            backgroundColor: "red",
          }}
        >
          Plead Your Case Before The Cabal (Register)
        </Button>
      </Box>
    </Box>
  );
};

export default UnauthorizedPage;
