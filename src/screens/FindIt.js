import { useEffect } from "react";
import Logout from "../components/auth/Logout";
import Center from "../components/utils/Center";
import NavBar from "../components/NavBar";
import AddBatch from "../components/AddBatch";
import { Box, Grid } from "@mui/material";
import Log from "./Log";

const BakeIt = (props) => {
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Center>
      <NavBar />
      <Box sx={{ width: "100%", marginTop: "64px" }}>
        <Grid>
          <Grid item xs={12} sm={8} md={6} lg={4}>
            <Log />
          </Grid>
        </Grid>
      </Box>
      <Logout />
    </Center>
  );
};

export default BakeIt;
