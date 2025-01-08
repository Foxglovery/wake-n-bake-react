import { useEffect } from "react";
import Logout from "../components/auth/Logout";
import Center from "../components/utils/Center";
import NavBar from "../components/NavBar";
import AddBatch from "../components/AddBatch";
import { Box, Grid } from "@mui/material";
import Log from "./Log";
import NavBarSimple from "../components/NavBarSimple";

const FindIt = (props) => {
  useEffect(() => {}, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Center height={"auto"}>
      <NavBar />
      <Log />
      <Logout />
    </Center>
  );
};

export default FindIt;
