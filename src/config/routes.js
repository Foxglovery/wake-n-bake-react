import AddARecipe from "../screens/AddRecipe";
import BakeIt from "../screens/BakeIt";
import FindIt from "../screens/FindIt";
import Home from "../screens/Home";
import Log from "../screens/Log";
import Login from "../screens/Login";

const routes = [
  {
    path: "",
    component: Home,
    name: "Home Page",
    protected: true,
  },
  {
    path: "/login",
    component: Login,
    name: "Login Screen",
    protected: false,
  },
  {
    path: "/findIt",
    component: FindIt,
    name: "Log of Batches",
    protected: true, // if user needs to be authenticated to access this screen
  },
  {
    path: "/bakeIt",
    component: BakeIt,
    name: "Adding a batch to the database",
    protected: true, // if user needs to be authenticated to access this screen
  },
  {
    path: "/addRecipe",
    component: AddARecipe,
    name: "Adding a recipe to the database",
    protected: true, // if user needs to be authenticated to access this screen
  },
];

export default routes;
