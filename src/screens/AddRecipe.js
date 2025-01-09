import { useEffect } from "react";
import Center from "../components/utils/Center";
import NavBar from "../components/NavBar";
import RecipeForm from "../components/AddRecipe";

const AddARecipe = (props) => {
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Center height={100}>
      <NavBar />
      <RecipeForm />
    </Center>
  );
};

export default AddARecipe;
