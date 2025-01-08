import { useEffect } from "react";
import Logout from "../components/auth/Logout";
import Center from "../components/utils/Center";
import NavBar from "../components/NavBar";

import { Box, Grid } from "@mui/material";
import RecipeForm from "../components/AddRecipe";

const AddARecipe = (props) => {
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Center>
      <NavBar />
      <Box sx={{ width: "100%", marginTop: "64px" }}>
        <Grid>
          <Grid item xs={12} sm={8} md={6} lg={4}>
            <RecipeForm />
          </Grid>
        </Grid>
      </Box>
      <Logout />
    </Center>
  );
};

export default AddARecipe;
