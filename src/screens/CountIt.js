import { useEffect } from "react";
import Center from "../components/utils/Center";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
//import InventoryGraph from "../components/Visualization/InventoryGraph";
import InventoryDashboard from "../components/Visualization/InventoryDashboard";
//import DataGridDemo from "../components/Visualization/DataGrid";
//import DataGridTest from "../components/Visualization/DataGrid";

const CountIt = (props) => {
  const navigate = useNavigate();
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Center height={"auto"}>
      <NavBar navigate={navigate} />

      <InventoryDashboard />
    </Center>
  );
};

export default CountIt;
