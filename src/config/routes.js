import AddBatch from "../screens/AddBatch";
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
    path: "/Log",
    component: Log,
    name: "Log of Batches",
    protected: true, // if user needs to be authenticated to access this screen
  },
  {
    path: "/AddBatch",
    component: AddBatch,
    name: "Adding a batch to the database",
    protected: true, // if user needs to be authenticated to access this screen
  },
];

export default routes;
