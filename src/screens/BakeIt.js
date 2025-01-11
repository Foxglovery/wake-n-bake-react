import { useEffect } from "react";
import Center from "../components/utils/Center";
import NavBar from "../components/NavBar";
import AddBatch from "../components/AddBatch";
import { useNavigate } from "react-router-dom";

const BakeIt = (props) => {
  const navigate = useNavigate();
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Center height={100}>
      <NavBar navigate={navigate} />
      <AddBatch />
    </Center>
  );
};

export default BakeIt;
