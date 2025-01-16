import Logout from "../components/auth/Logout";
import AddARecipe from "../screens/AddRecipe";
import BakeIt from "../screens/BakeIt";
import DoseIt from "../screens/DoseIt";
import EditBatch from "../screens/EditBatch";
import FindIt from "../screens/FindIt";
import Home from "../screens/Home";
import Login from "../screens/Login";
import CountIt from "../screens/CountIt";
import UnauthorizedPage from "../components/auth/UnauthorizedPage";
import Profile from "../screens/Profile";

const routes = [
  {
    path: "/",
    component: Home,
    name: "Home Page",
    protected: true,
    allowedRoles: ["admin", "employee"], // Both admin and employees can access
    exact: true,
  },
  {
    path: "/login",
    component: Login,
    name: "Login Screen",
    protected: false, // Accessible to everyone
  },
  {
    path: "/logout",
    component: Logout,
    name: "Logout Screen",
    protected: false, // Accessible to everyone
  },
  {
    path: "/findIt",
    component: FindIt,
    name: "Log of Batches",
    protected: true,
    allowedRoles: ["admin", "employee"], // Admins and employees can view batches
  },
  {
    path: "/bakeIt",
    component: BakeIt,
    name: "Adding a batch to the database",
    protected: true,
    allowedRoles: ["admin", "employee"], // Only admin can add batches
  },
  {
    path: "/doseIt",
    component: DoseIt,
    name: "Calculating the required units to meet dosage",
    protected: true,
    allowedRoles: ["admin"], // Both admin and employees can calculate dosage
  },
  {
    path: "/countIt",
    component: CountIt,
    name: "Presenting visual representations of inventory",
    protected: true,
    allowedRoles: ["admin", "employee"], // Both admin and employees can view inventory
  },
  {
    path: "/addRecipe",
    component: AddARecipe,
    name: "Adding a recipe to the database",
    protected: true,
    allowedRoles: ["admin"], // Only admin can add recipes
  },
  {
    path: "/batch/:id",
    component: EditBatch,
    name: "Viewing and updating a specific batch",
    protected: true,
    allowedRoles: ["admin"], // Only admin can update batches
  },
  {
    path: "/profile",
    component: Profile,
    name: "Viewing user details",
    protected: true,
    allowedRoles: ["admin", "employee"], // Only admin can update batches
  },
  {
    path: "/unauthorized",
    component: UnauthorizedPage,
    name: "Unauthorized Access",
    protected: false, // Accessible to everyone
  },
  {
    path: "*",
    component: () => (
      <div style={{ textAlign: "center" }}>
        <h1>404 - Page Not Found</h1>
        <button onClick={() => (window.location.href = "/")}>Go Home</button>
      </div>
    ),
    name: "Not Found",
    protected: false, // Accessible to everyone
  },
];

export default routes;
