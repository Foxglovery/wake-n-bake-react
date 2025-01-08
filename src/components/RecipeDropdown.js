import React, { useEffect, useState } from "react";
import { database } from "../config/firebase";

function RecipeDropdown() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const dbRef = ref(database, "recipes");
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        const recipes = Object.values(snapshot.val());
        setRecipes(recipes);
      } else {
        console.log("No Recipes Found");
      }
    };

    fetchRecipes();
  }, []);
  return (
    <select>
      {recipes.map((recipe, index) => (
        <option key={index} value={recipe.id}>
          {recipe.name}
        </option>
      ))}
    </select>
  );
}

export default RecipeDropdown;
