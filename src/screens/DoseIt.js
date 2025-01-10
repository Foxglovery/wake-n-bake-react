import { useEffect } from "react";
import Center from "../components/utils/Center";
import NavBar from "../components/NavBar";
import DosageCalculator from "../components/DosageCalculator";

const DoseIt = (props) => {
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Center height={100}>
      <NavBar />
      <DosageCalculator />
    </Center>
  );
};

export default DoseIt;
