import Logout from "../components/auth/Logout";
import AddARecipe from "../screens/AddRecipe";
import BakeIt from "../screens/BakeIt";
import DoseIt from "../screens/DoseIt";
import EditBatch from "../screens/EditBatch";
import FindIt from "../screens/FindIt";
import Home from "../screens/Home";

import Login from "../screens/Login";
import CountIt from "../screens/CountIt";

const routes = [
  {
    path: "/",
    component: Home,
    name: "Home Page",
    protected: true,
    exact: true, // Ensures exact match
  },
  {
    path: "/login",
    component: Login,
    name: "Login Screen",
    protected: false,
  },
  {
    path: "/logout",
    component: Logout,
    name: "Logout Screen",
    protected: false,
  },
  {
    path: "/findIt",
    component: FindIt,
    name: "Log of Batches",
    protected: true,
  },
  {
    path: "/bakeIt",
    component: BakeIt,
    name: "Adding a batch to the database",
    protected: true,
  },
  {
    path: "/doseIt",
    component: DoseIt,
    name: "Calculating the required units to meet dosage",
    protected: true,
  },
  {
    path: "/countIt",
    component: CountIt,
    name: "Presenting visual representations of inventory",
    protected: true,
  },
  {
    path: "/addRecipe",
    component: AddARecipe,
    name: "Adding a recipe to the database",
    protected: true,
  },
  {
    path: "/batch/:id",
    component: EditBatch,
    name: "Viewing a specific card and allowing for Update/Delete",
    protected: true,
  },
  {
    path: "*",
    component: () => <h1>404 - Page Not Found</h1>,
    name: "Not Found",
    protected: false,
  },
];

export default routes;
