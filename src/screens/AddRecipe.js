import { useEffect } from "react";
import Center from "../components/utils/Center";
import NavBar from "../components/NavBar";
import RecipeForm from "../components/AddRecipe";
import { useNavigate } from "react-router-dom";

const AddARecipe = (props) => {
  const navigate = useNavigate();
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Center height={100}>
      <NavBar navigate={navigate} />
      <RecipeForm />
    </Center>
  );
};

export default AddARecipe;
