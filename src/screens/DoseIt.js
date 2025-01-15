import { useEffect } from "react";
import Center from "../components/utils/Center";
import NavBar from "../components/NavBar";
import DosageCalculator from "../components/DosageCalculator";
import { useNavigate } from "react-router-dom";
import GoogleSheetFetcher from "../components/GoogleSheetFetcher";
import InventoryGraph from "../components/Visualization/InventoryGraph";

const DoseIt = (props) => {
  const navigate = useNavigate();
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Center height={100}>
      <NavBar navigate={navigate} />
      <DosageCalculator />
      {/* <GoogleSheetFetcher /> */}
      {/* <InventoryGraph /> */}
    </Center>
  );
};

export default DoseIt;
