import { useEffect } from "react";
import Logout from "../components/auth/Logout";
import Center from "../components/utils/Center";
import NavBar from "../components/NavBar";
import AddBatch from "../components/AddBatch";
import { Box, Grid } from "@mui/material";
import NavBarSimple from "../components/NavBarSimple";

const BakeIt = (props) => {
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Center height={100}>
      <NavBar />
      <AddBatch />
      <Logout />
    </Center>
  );
};

export default BakeIt;
