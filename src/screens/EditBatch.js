import { useEffect } from "react";
import Center from "../components/utils/Center";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import BatchCard from "../components/BatchCard";

const EditBatch = (props) => {
  const navigate = useNavigate();
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Center height={100}>
      <NavBar navigate={navigate} />
      <BatchCard />
    </Center>
  );
};

export default EditBatch;
