import { useEffect } from "react";
import Logout from "../components/auth/Logout";
import Center from "../components/utils/Center";
import NavBar from "../components/NavBar";

import { Box, Grid } from "@mui/material";
import RecipeForm from "../components/AddRecipe";
import NavBarSimple from "../components/NavBarSimple";

const AddARecipe = (props) => {
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Center height={100}>
      <NavBar />
      <RecipeForm />
      <Logout />
    </Center>
  );
};

export default AddARecipe;
