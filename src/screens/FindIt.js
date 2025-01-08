import { useEffect } from "react";
import Logout from "../components/auth/Logout";
import Center from "../components/utils/Center";
import NavBar from "../components/NavBar";
import AddBatch from "../components/AddBatch";
import { Box, Grid } from "@mui/material";
import Log from "./Log";

const FindIt = (props) => {
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Center>
      <NavBar />
      {/* Adjust marginTop to properly offset the fixed/sticky navbar */}
      <Box
        sx={{
          width: "100%",
          marginTop: { xs: "80px", sm: "96px" }, // Dynamically adjust based on screen size
        }}
      >
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={6} lg={4}>
            <Log />
          </Grid>
        </Grid>
      </Box>
      <Logout />
    </Center>
  );
};

export default FindIt;
