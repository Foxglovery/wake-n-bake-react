import { useEffect } from "react";
import Logout from "../components/auth/Logout";
import Center from "../components/utils/Center";
import Log from "./Log";
import SignIn from "./Log";
import BatchCard from "../components/BatchCard";
import NavBar from "../components/NavBar";
import AddBatch from "../components/AddBatch";

const BakeIt = (props) => {
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Center>
      <NavBar />
      <AddBatch />
      <Logout />
    </Center>
  );
};

export default BakeIt;
